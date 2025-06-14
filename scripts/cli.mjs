import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Explicitly import fileURLToPath
import { program } from 'commander';
import ora from 'ora';

program
  .name('Garanteasier')
  .description('CLI for generating components and utilities for Garanteasier')
  .version('0.8.0');

program
  .command('generate <type> <name>', 'Generate a new garanteasiy element')
  .alias('g')
  .action((type, name) => {
    const spinner = ora(`Generate ${type} ${name}`).start();
    switch(type) {
      case 'component':
        createComponent(name);
        spinner.color = 'green';
        spinner.text = `Component ${name} created successfully. ✅`;
        break;
      default:
        spinner.color = 'red';
        spinner.text = `Unknown type: ${type}. Use 'component' or 'utility'. ❌`;
    }
    spinner.stop();
  });

program
.command('generate-component <name>')
  .alias('gc')
  .description('Generate a new component') // Use .description() instead of passing it to .command()
  .action((name) => {
    const spinner = ora(`Generate ${name} Component`).start();
    try {
      createComponent(name);
      spinner.color = 'green';
      spinner.text = `Component ${name} created successfully. ✅`;
      spinner.stop();
      console.log(`Component ${name} created successfully. ✅`);
    } catch {
      spinner.color = 'red';
      spinner.text = `Failed to create component ${name}. ❌`;
      spinner.stop();
    }
});

program.parse(process.argv);

function createComponent(name) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname correctly
  const stubDirectory = path.join(__dirname, 'stubs', 'component', 'ui');
  const componentPath = path.join(process.cwd(), 'components', 'ui', name);

  // Create base component
  fs.mkdirSync(componentPath, { recursive: true });
  const indexStubPath = path.join(stubDirectory, 'element.component.stub');
  const indexContent = fs.readFileSync(indexStubPath, 'utf-8')
    .replace(/{{ElementComponent}}/g, name)
    .replace(/{{elementComponent}}/g, name.toLowerCase())
    .replace(/{{IElementProps}}/g, `I${name}Props`)
    .replace(/{{ElementStyles}}/g, `${name}Styles`);
  fs.writeFileSync(path.join(componentPath, 'index.tsx'), indexContent);

  // Create types file
  const typesStubPath = path.join(stubDirectory, 'types.component.stub');
  const typesContent = fs.readFileSync(typesStubPath, 'utf-8')
    .replace(/{{IElementProps}}/g, `I${name}Props`);
  fs.writeFileSync(path.join(componentPath, '@types.ts'), typesContent);

  // Create tests
  const testsStubPath = path.join(stubDirectory, 'tests.component.stub');
  const testsContent = fs.readFileSync(testsStubPath, 'utf-8')
    .replace(/{{ElementComponent}}/g, name)
    .replace(/{{IElementProps}}/g, `I${name}Props`);
  //Create tests directory if it doesn't exist
  const testsDir = path.join(componentPath, '__tests__');
  fs.mkdirSync(testsDir, { recursive: true });
  fs.writeFileSync(path.join(testsDir, `${name}.spec.tsx`), testsContent);

  // Create storybook file
  const storybookStubPath = path.join(stubDirectory, 'storybook.component.stub');
  const storybookContent = fs.readFileSync(storybookStubPath, 'utf-8')
    .replace(/{{ElementComponent}}/g, name)
    .replace(/{{IElementProps}}/g, `I${name}Props`);
  fs.writeFileSync(path.join(componentPath, `${name}.stories.tsx`), storybookContent);

  // Create styles file
  const stylesStubPath = path.join(stubDirectory, 'styles.component.stub');
  const stylesContent = fs.readFileSync(stylesStubPath, 'utf-8')
    .replace(/{{ElementStyles}}/g, `${name}Styles`);
  fs.writeFileSync(path.join(componentPath, 'styles.ts'), stylesContent);
}
