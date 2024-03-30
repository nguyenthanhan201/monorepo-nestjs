// camelCase: changeFormatToThis
// snakeCase: change_format_to_this
// dashCase/kebabCase: change-format-to-this
// dotCase: change.format.to.this
// pathCase: change/format/to/this
// properCase/pascalCase: ChangeFormatToThis
// lowerCase: change format to this
// sentenceCase: Change format to this,
// constantCase: CHANGE_FORMAT_TO_THIS
// titleCase: Change Format To This

import { NodePlopAPI } from 'plop';

const convertToKebabCase = (text: string) => {
  const regex = /\s|-|_/g;
  text = text.toLowerCase();
  let words = text.split(regex);

  return words.join('-');
};

export default function (plop: NodePlopAPI) {
  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'controller name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/modules/{{kebabCase name}}/{{kebabCase name}}.module.ts',
        templateFile: 'plop-templates/modules/module.hbs',
      },
      {
        type: 'modify',
        path: 'src/modules/app.module.ts',
        transform(template, data, cfg) {
          const tsCode = template;
          const newModule =
            String(data.name).charAt(0).toUpperCase() +
            String(data.name).slice(1) +
            'Module';
          const kebabCaseName = convertToKebabCase(data.name);

          // Find the position after UploadModule
          const indexAfterUploadModule =
            tsCode.indexOf('AddNewModule') + 'AddNewModule'.length;

          // Insert the new module after UploadModule
          const updatedCode = [
            `import { ${newModule} } from './${kebabCaseName}/${kebabCaseName}.module';`,
            `${tsCode.slice(
              0,
              indexAfterUploadModule,
            )},\n    ${newModule}\n    ${tsCode.slice(indexAfterUploadModule)}`,
          ].join(' ');

          // console.log('👌  template:', template);
          // console.log('👌  data:', data);
          // console.log('👌  cfg:', cfg);
          return updatedCode;
        },
      },
    ],
  });

  // ------------ plop helper ------
  // singular nouns to plural nouns
  plop.setHelper('pluralize', function (text) {
    const regex = /\s|-|_/g;
    text = text.toLowerCase();
    let words = text.split(regex);

    words = words.map((word, index) => {
      if (index == words.length - 1) {
        return word + 's';
      }
      return word;
    });

    return words.join('');
  });

  // camelCase
  plop.setHelper('camelCase', function (text) {
    const regex = /\s|-|_/g;
    text = text.toLowerCase();
    let words = text.split(regex);

    words = words.map((word, index) => {
      return index != 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });

    console.log(words.join(''));

    return words.join('');
  });

  // properCase
  plop.setHelper('properCase', function (text) {
    const regex = /\s|-|_/g;
    text = text.toLowerCase();
    let words = text.split(regex);

    words = words.map((word, index) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return words.join('');
  });

  // kebabCase
  plop.setHelper('kebabCase', function (text) {
    const regex = /\s|-|_/g;
    text = text.toLowerCase();
    let words = text.split(regex);

    return words.join('-');
  });
}
