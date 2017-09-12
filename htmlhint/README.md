# vscode-htmlhint

Integrates the [HTMLHint](https://github.com/yaniswang/HTMLHint) static analysis tool into Visual Studio Code.

![hero](images/hero.png)

## Configuration

The HTMLHint extension will attempt to use the locally installed HTMLHint module (the project-specific module if present, or a globally installed HTMLHint module).  If a locally installed HTMLHint isn't available, the extension will use the embedded version (current version 0.9.13).

To install a version to the local project folder, run `npm install --save-dev htmlhint`.  To install a global version on the current machine, run `npm install --global htmlhint`.

## Usage

The HTMLHint extension will run HTMLHint on your open HTML files and report the number of errors on the Status Bar with details in the Problems panel (**View** > **Problems**).

![status bar](images/status-bar.png)

Errors in HTML files are highlighted with squiggles and you can hover over the squiggles to see the error message.

![hover](images/hover.png)

>**Note:** HTMLHint will only analyze open HTML files and does not search for HTML files in your project folder.

## Rules

The HTMLHint extension uses the default [rules](https://github.com/yaniswang/HTMLHint/wiki/Usage#about-rules) provided by HTMLHint.

```json
{
    "tagname-lowercase": true,
    "attr-lowercase": true,
    "attr-value-double-quotes": true,
    "doctype-first": true,
    "tag-pair": true,
    "spec-char-escape": true,
    "id-unique": true,
    "src-not-empty": true,
    "attr-no-duplication": true,
    "title-require": true
}
```

## .htmlhintrc

If you'd like to modify the rules, you can provide a `.htmlhintrc` file in the root of your project folder with a reduced ruleset or modified values.

You can learn more about rule configuration at the HTMLHint [Usage page](https://github.com/yaniswang/HTMLHint/wiki/Usage#cli).

## Settings

The HTMLHint extension provides three [settings](https://code.visualstudio.com/docs/customization/userandworkspace):

* `htmlhint.enable` - disable the HTMLHint extension globally or per workspace.
* `htmlhint.extensions` - specify additional file extensions to be linted
* `htmlhint.options` - provide a rule set to override on disk `.htmlhintrc` or HTMLHint defaults.

You can change settings globally (**File** > **Preferences** > **User Settings**) or per workspace (**File** > **Preferences** > **Workspace Settings**). The **Preferences** menu is under **Code** on macOS.

Here's an example using the `htmlhint.extensions` and `htmlhint.options` settings:

```json
"htmlhint.extensions: [
    "html",
    "htm",
    "twig",
    "mustache"
],
"htmlhint.options": {
    "tagname-lowercase": false,
    "attr-lowercase": true,
    "attr-value-double-quotes":  true,
    "doctype-first": true
}
```
