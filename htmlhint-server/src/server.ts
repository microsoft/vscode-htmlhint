/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/htmlhint/htmlhint.d.ts" />

//import * as fs from 'fs';
import * as path from 'path';

import * as server from 'vscode-languageserver';

import htmlhint = require('htmlhint');

interface Settings {
	htmlhint: {
		enable: boolean;
		rulesDirectory: string;
		formatterDirectory: string
	}
}

let settings: Settings = null;
let rulesDirectory: string = null;
let formatterDirectory: string = null;
let linter: any = null;

/*
let options: Lint.ILinterOptions = {
	formatter: "json",
	configuration: {},
	rulesDirectory: undefined,
	formattersDirectory: undefined
};
*/

let configCache = {
	filePath: <string>null,
	configuration: <any>null
}

function getRange(error: htmlhint.Error, lines : string[] ) : any {

    // approximate way to find the range of the element where the error is being reported.
    let line = lines[error.line - 1];
    var isWhitespace = false;
	var curr = error.col;
    while ( curr < line.length && !isWhitespace ) {
        var char = line[curr];
        isWhitespace = (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '<' );
		++curr;
	}

	if ( isWhitespace ) {
        --curr;
    }

    return {
        start : {
            line: error.line - 1, // Html-hint line numbers are 1-based.
            character: error.col - 1
        },
        end: {
            line: error.line - 1,
            character: curr
        }
    };
}

function makeDiagnostic(problem: htmlhint.Error, lines: string[]): server.Diagnostic {

	return {
		severity: server.DiagnosticSeverity.Warning,
		message: problem.message,
		range: getRange(problem, lines),
		code: problem.rule.id
	};
}

function getConfiguration(filePath: string): any {
	// TODO
	return {};
	/*
	if (configCache.configuration && configCache.filePath === filePath) {
		return configCache.configuration;
	}
	configCache = {
		filePath: filePath,
		configuration: linter.findConfiguration(null, filePath)
	}
	return configCache.configuration;
	*/
}

function flushConfigCache() {
	configCache = {
		filePath: null,
		configuration: null
	}
}

function getErrorMessage(err: any, document: server.ITextDocument): string {
	let result: string = null;
	if (typeof err.message === 'string' || err.message instanceof String) {
		result = <string>err.message;
	} else {
		result = `An unknown error occured while validating file: ${server.Files.uriToFilePath(document.uri) }`;
	}
	return result;
}

function validateAllTextDocuments(connection: server.IConnection, documents: server.ITextDocument[]): void {
	let tracker = new server.ErrorMessageTracker();
	documents.forEach(document => {
		try {
			validateTextDocument(connection, document);
		} catch (err) {
			tracker.add(getErrorMessage(err, document));
		}
	});
	tracker.sendErrors(connection);
}

function validateTextDocument(connection: server.IConnection, document: server.ITextDocument): void {
	try {
		doValidate(connection, document);
	} catch (err) {
		connection.window.showErrorMessage(getErrorMessage(err, document));
	}
}

let connection: server.IConnection = server.createConnection(process.stdin, process.stdout);
let documents: server.TextDocuments = new server.TextDocuments();
documents.listen(connection);

connection.onInitialize((params): server.InitializeResult => {
	linter = htmlhint.HTMLHint;
	let result: server.InitializeResult = { capabilities: { textDocumentSync: documents.syncKind } };
	return result;
});


function doValidate(connection: server.IConnection, document: server.ITextDocument): void {
	try {
		let uri = document.uri;
		let fsPath = server.Files.uriToFilePath(uri);
		let contents = document.getText();
		let lines = contents.split('\n');

        // TODO
		//options.configuration = getConfiguration(fsPath);

		let errors : htmlhint.Error[] = linter.verify(contents);

		let diagnostics: server.Diagnostic[] = [];
		if (errors.length > 0) {
			errors.forEach(each => {
				diagnostics.push(makeDiagnostic(each, lines));
			});
		}
		connection.sendDiagnostics({ uri, diagnostics });
	} catch (err) {
		let message: string = null;
		if (typeof err.message === 'string' || err.message instanceof String) {
			message = <string>err.message;
			throw new Error(message);
		}
		throw err;
	}
}

// A text document has changed. Validate the document.
documents.onDidChangeContent((event) => {
	// the contents of a text document has changed
	validateTextDocument(connection, event.document);
});

// The VS Code htmlhint settings have changed. Revalidate all documents.
connection.onDidChangeConfiguration((params) => {
	flushConfigCache();
	settings = params.settings;

	if (settings.htmlhint) {
		rulesDirectory = settings.htmlhint.rulesDirectory;
		formatterDirectory = settings.htmlhint.formatterDirectory;
	}
	validateAllTextDocuments(connection, documents.all());
});

// The watched htmlhint.json has changed. Revalidate all documents.
connection.onDidChangeWatchedFiles((params) => {
	flushConfigCache();
	validateAllTextDocuments(connection, documents.all());
});

connection.listen();