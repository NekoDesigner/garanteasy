import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Explicitly import fileURLToPath
import { program } from 'commander';
import ora from 'ora';

program
  .name('Garanteasier')
  .description('CLI for generating components and hooks for Garanteasier')
  .version('0.8.0');

program
  .command('generate <type> <name>', 'Generate a new Garanteasy Element')
  .alias('g')
  .action((type, name) => {
    const spinner = ora(`Generate ${type} ${name}`).start();
    switch(type) {
      case 'component':
        createComponent(name);
        spinner.color = 'green';
        spinner.text = `Component ${name} created successfully. ✅`;
        break;
      case 'hook':
        createHook(name);
        spinner.color = 'green';
        spinner.text = `Hook use${firstLetterToUpperCase(name)} created successfully. ✅`;
        break;
      case 'icon':
        createIconComponent(name);
        spinner.color = 'green';
        spinner.text = `Icon ${name} created successfully. ✅`;
        break;
      case 'migration':
        const fileName = createMigration(name);
        spinner.color = 'green';
        spinner.text = `Migration ${fileName} created successfully. ✅`;
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
  .description('Generate a new Component') // Use .description() instead of passing it to .command()
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

program
.command('generate-icon <name>')
  .alias('gic')
  .description('Generate a new Icon Component') // Use .description() instead of passing it to .command()
  .action((name) => {
    const iconName = `${firstLetterToUpperCase(name)}Icon`;
    const spinner = ora(`Generate ${name} hook`).start();
    try {
      createIconComponent(name);
      spinner.color = 'green';
      spinner.text = `Icon component ${iconName} created successfully. ✅`;
      spinner.stop();
      console.log(`Icon component ${iconName} created successfully. ✅`);
    } catch {
      spinner.color = 'red';
      spinner.text = `Failed to create icon component ${iconName}. ❌`;
      spinner.stop();
    }
});

program
.command('generate-hook <name>')
  .alias('gh')
  .description('Generate a new Hook') // Use .description() instead of passing it to .command()
  .action((name) => {
    const hookName = `use${firstLetterToUpperCase(name)}`;
    const spinner = ora(`Generate ${hookName} hook`).start();
    try {
      createHook(name);
      spinner.color = 'green';
      spinner.text = `Hook ${hookName} created successfully. ✅`;
      spinner.stop();
      console.log(`Hook ${hookName} created successfully. ✅`);
    } catch {
      spinner.color = 'red';
      spinner.text = `Failed to create hook ${hookName}. ❌`;
      spinner.stop();
    }
});

program
  .command('generate-migration <name>')
  .alias('gm')
  .description('Generate a new Migration')
  .action((name) => {
    let fileName = name;
    const spinner = ora(`Generate migration ${name}`).start();
    try {
      fileName = createMigration(name);
      spinner.color = 'green';
      spinner.text = `Migration ${fileName} created successfully. ✅`;
      spinner.stop();
      console.log(`Migration ${fileName} created successfully. ✅`);
    } catch (error) {
      spinner.color = 'red';
      spinner.text = `Failed to create migration ${fileName}. ❌`;
      spinner.stop();
      console.error(`Error creating migration ${fileName}:`, error.message);
    }
  });

program.parse(process.argv);

/**
 *  Creates a new component with the given name.
 *  It generates the necessary files and directories for the component.
 *  @param {string} name - The name of the component to create.
 *  @throws Will throw an error if the component cannot be created.
 */
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

/**
 *  Creates a new hook with the given name.
 *  It generates the necessary files and directories for the hook.
 *  @param {string} name - The name of the hook to create.
 *  @throws Will throw an error if the hook cannot be created.
 */
function createHook(name) {
  const hookName = `use${firstLetterToUpperCase(name)}`;
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname correctly
  const stubDirectory = path.join(__dirname, 'stubs', 'hooks');
  const hookPath = path.join(process.cwd(), 'hooks', hookName);
  const testsDir = path.join(hookPath, '__tests__');

  // Create base component
  fs.mkdirSync(hookPath, { recursive: true });
  const hookStubPath = path.join(stubDirectory, 'element.hook.stub');
  const hookContent = fs.readFileSync(hookStubPath, 'utf-8')
    .replace(/{{hookElement}}/g, firstLetterToUpperCase(name));
  fs.writeFileSync(path.join(hookPath, `${hookName}.ts`), hookContent);

  // Create tests file
  fs.mkdirSync(testsDir, { recursive: true });
  fs.writeFileSync(path.join(testsDir, `${hookName}.spec.ts`), `// TODO: Add tests for use${firstLetterToUpperCase(name)} hook`);
}

/**
 *  Creates a new icon component with the given name.
 *  It generates the necessary files and directories for the icon component.
 *  @param {string} name - The name of the icon component to create.
 *  @throws Will throw an error if the icon component cannot be created.
 */
function createIconComponent(name) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname correctly
  const stubDirectory = path.join(__dirname, 'stubs', 'component', 'ui');
  const iconPath = path.join(process.cwd(), 'components', 'ui', 'Icons');

  // Create base component
  const indexStubPath = path.join(stubDirectory, 'icon.component.stub');
  const indexContent = fs.readFileSync(indexStubPath, 'utf-8')
    .replace(/{{IconComponent}}/g, name);
  fs.writeFileSync(path.join(iconPath, `${firstLetterToUpperCase(name)}Icon.tsx`), indexContent);
}

/**
 * Creates a new migration file with the given name.
 * @param {string} name - The name of the migration to create.
 * @returns {string} The name of the created migration file.
 * @throws Will throw an error if the migration cannot be created.
 * @example
 * createMigration('add_users_table'); // Creates a migration file for adding users table
 * @throws Will throw an error if the migration directory does not exist or is not a directory
 * @throws Will throw an error if there is an issue reading the stub file or writing the migration file.
 * @description
 * This function generates a new migration file in the 'database/migrations' directory.
 */
function createMigration(name) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Resolve __dirname correctly
  const stubDirectory = path.join(__dirname, 'stubs', 'database');
  const migrationPath = path.join(process.cwd(), 'database', 'migrations');
  const migrationName = `${firstLetterToUpperCase(name)}Migration-${Date.now()}`;
  const migrationFileName = `${migrationName}.ts`;
  const migrationFilePath = path.join(migrationPath, migrationFileName);
  const fileCount = countFilesInDirectory(migrationPath) + 1;
  const migrationContent = fs.readFileSync(path.join(stubDirectory, 'migration.template.stub'), 'utf-8')
    .replace(/{{MigrationTemplate}}/g, migrationName.replace(/-/g, ''))
    .replace(/{{MIGRATION_NUMBER}}/g, fileCount.toString());
  fs.writeFileSync(migrationFilePath, migrationContent);

  // Ensure the migrations directory exists
  updateDatabaseMigrationConstantsList();

  return migrationFileName;
}

function updateDatabaseMigrationConstantsList() {
  const basePath = path.join(process.cwd(), 'database');
  const migrationPath = path.join(basePath, 'migrations');
  const migrationsFilePath = path.join(basePath, 'index.ts');
  fs.readdir(migrationPath, (err, files) => {
    if (err) {
      console.error('Error reading migration directory:', err);
      return;
    }
    const migrationFiles = files.filter(file => file.endsWith('.ts') && file !== 'index.ts');
    const migrationImports = migrationFiles.map(file => `import { ${file.replace('.ts', '').replace('-', '')} } from './migrations/${file.replace('.ts', '')}';`).join('\n');
    const migrationExports = migrationFiles.map(file => `\n    new ${file.replace('.ts', '').replace('-', '')}()`).join(',');
    const content = `${migrationImports}\n\nexport const DATABASE_MIGRATIONS = [${migrationExports}\n];\n`;
    fs.writeFileSync(migrationsFilePath, content);
  });
}

/**
 * Counts the number of files in a directory and its subdirectories.
 * @param {string} directory - The directory to count files in.
 * @returns {number} The total number of files in the directory and its subdirectories.
 * @example
 * countFilesInDirectory('/path/to/directory'); // Returns the number of files in the directory
 * @throws Will throw an error if the directory does not exist or is not a directory
 * @throws Will throw an error if there is an issue reading the directory or its contents.
 */
function countFilesInDirectory(directory) {
  let fileCount = 0;
  const items = fs.readdirSync(directory);
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      fileCount += countFilesInDirectory(itemPath); // Recursively count files in subdirectories
    }
    else if (stats.isFile()) {
      fileCount++;
    }
  }
  return fileCount;
}

/**
 * Converts the first letter of a string to uppercase.
 * @param {string} str - The string to convert.
 * @returns {string} The string with the first letter converted to uppercase.
 * @example
 * firstLetterToUpperCase('hello'); // Returns 'Hello'
 * firstLetterToUpperCase('world'); // Returns 'World'
 */
function firstLetterToUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
