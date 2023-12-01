import { addMonacoStyles, defineUserServices, MonacoEditorLanguageClientWrapper } from './bundle/index.js';
import { configureWorker } from './setup.js';

addMonacoStyles('monaco-editor-styles');

export const setupConfigExtended = () => {
    const extensionFilesOrContents = new Map();
    const languageConfigUrl = new URL('../language-configuration.json', window.location.href);
    const textmateConfigUrl = new URL('../syntaxes/todotxt.tmLanguage.json', window.location.href);
    extensionFilesOrContents.set('/language-configuration.json', languageConfigUrl);
    extensionFilesOrContents.set('/todotxt-grammar.json', textmateConfigUrl);

    return {
        wrapperConfig: {
            serviceConfig: defineUserServices(),
            editorAppConfig: {
                $type: 'extended',
                languageId: 'todotxt',
                code: `// todotxt is running in the web!`,
                useDiffEditor: false,
                extensions: [{
                    config: {
                        name: 'todotxt-web',
                        publisher: 'generator-langium',
                        version: '1.0.0',
                        engines: {
                            vscode: '*'
                        },
                        contributes: {
                            languages: [{
                                id: 'todotxt',
                                extensions: [
                                    '.todotxt'
                                ],
                                configuration: './language-configuration.json'
                            }],
                            grammars: [{
                                language: 'todotxt',
                                scopeName: 'source.todotxt',
                                path: './todotxt-grammar.json'
                            }]
                        }
                    },
                    filesOrContents: extensionFilesOrContents,
                }],                
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': 'Default Dark Modern',
                        'editor.semanticHighlighting.enabled': true
                    })
                }
            }
        },
        languageClientConfig: configureWorker()
    };
};

export const executeExtended = async (htmlElement) => {
    const userConfig = setupConfigExtended();
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.start(userConfig, htmlElement);
};
