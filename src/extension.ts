'use strict'
import {
    ExtensionContext,
    window,
    workspace,
    Range,
    Position,
    TextEditor,
    TextEditorDecorationType,
} from 'vscode'

export async function activate(context: ExtensionContext) {
    let decorationType = getDecorationTypeFromConfig();
    let activeEditor: TextEditor | undefined = window.activeTextEditor;
    let lastActivePosition: Position | undefined = activeEditor
    ? activeEditor.selection.active
    : undefined;

    function syncLastActivePosition(editor: TextEditor | undefined) {
        if (!editor) {
            lastActivePosition = undefined;
            return;
        }
        lastActivePosition = editor.selection.active;
    }

    function updateDecorations(
        decorationType: TextEditorDecorationType,
        updateAllVisibleEditors = false
    ) {
        try {
            if (updateAllVisibleEditors) {
                window.visibleTextEditors.forEach((editor) => {
                    const currentPosition = editor.selection.active;
                    const newDecoration = {
                        range: new Range(currentPosition, currentPosition),
                    };
                    editor.setDecorations(decorationType, [newDecoration]);
                });
                return;
            }

            const editor = activeEditor;
            if (!editor) {
                return;
            }

            const currentPosition = editor.selection.active;

            // 第一次进入时，先初始化
            if (!lastActivePosition) {
                const newDecoration = {
                    range: new Range(currentPosition, currentPosition),
                };
                editor.setDecorations(decorationType, [newDecoration]);
                lastActivePosition = currentPosition;
                return;
            }

            const editorHasChangedLines =
                lastActivePosition.line !== currentPosition.line;

            const isNewEditor =
                editor.document.lineCount === 1 &&
                lastActivePosition.line === 0 &&
                lastActivePosition.character === 0;

            if (editorHasChangedLines || isNewEditor) {
                const newDecoration = {
                    range: new Range(currentPosition, currentPosition),
                };
                editor.setDecorations(decorationType, [newDecoration]);
            }

            lastActivePosition = currentPosition;
        } catch (error) {
            console.error("Error from 'updateDecorations' -->", error);
        }
    }

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor((editor) => {
            try {
                activeEditor = editor;

                if (!editor) {
                    lastActivePosition = undefined;
                    return;
                }

                updateDecorations(decorationType);
            } catch (error) {
                console.error("Error from 'window.onDidChangeActiveTextEditor' -->", error);
            } finally {
                syncLastActivePosition(editor);
            }
        })
    );

    context.subscriptions.push(
        window.onDidChangeTextEditorSelection((event) => {
            try {
                activeEditor = event.textEditor;
                updateDecorations(decorationType);
            } catch (error) {
                console.error("Error from 'window.onDidChangeTextEditorSelection' -->", error);
            } finally {
                syncLastActivePosition(event.textEditor);
            }
        })
    );

    context.subscriptions.push(
        workspace.onDidChangeConfiguration(() => {
            decorationType.dispose();
            decorationType = getDecorationTypeFromConfig();
            updateDecorations(decorationType, true);
        })
    );
}

// UTILITIES
function getDecorationTypeFromConfig() {
    const config = workspace.getConfiguration('highlightLine');
    const borderColor = config.get<string>('borderColor');
    const borderWidth = config.get<string>('borderWidth');
    const borderStyle = config.get<string>('borderStyle');

    return window.createTextEditorDecorationType({
        isWholeLine: true,
        borderWidth: `0 0 ${borderWidth} 0`,
        borderStyle: `${borderStyle}`,
        borderColor,
    });
}

export function deactivate() {}