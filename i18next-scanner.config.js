const fs = require("fs");
const typescript = require('typescript');
const path = require('path')

module.exports = {
    input: [
        'src/**/*.{js,ts}',
        '!dist/**',
        '!i18n/**',
        '!**/node_modules/**',
    ],
    output: "./",
    options: {
        removeUnusedKeys: true,
        sort: true,
        func: {
            list: ["i18next.t", "i18n.t", "t"],
            extensions: ['js', 'ts'],
        },
        lngs: ['en', 'es'],
        defaultLng: 'en',
        defaultValue: '',
        resource: {
            loadPath: "i18n/translations/{{lng}}.json", // Set the route you want
            savePath: "i18n/translations/{{lng}}.json", // ""
            jsonIndent: 2,
            lineEnding: "\n",
        },
        keySeparator: ".",
        pluralSeparator: "_",
        contextSeparator: "_",
        contextDefaultValues: [],
        interpolation: {
            prefix: "{{",
            suffix: "}}",
        },
    },
    transform: function customTransform(file, enc, done) {
        "use strict";
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        const { base, ext } = path.parse(file.path);

        if (['.ts', '.tsx'].includes(ext) && !base.includes('.d.ts')) {
            const { outputText } = typescript.transpileModule(content, {
                compilerOptions: {
                    target: 'es2018',
                },
                fileName: path.basename(file.path),
            });

            parser.parseTransFromString(outputText);
            parser.parseFuncFromString(outputText);
        }

        done();
    }
}
