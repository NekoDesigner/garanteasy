import { AddBrandColumnToItemsTableMigration1751057246774 } from './migrations/AddBrandColumnToItemsTableMigration-1751057246774';
import { AddTypeColumnFromDocumentTableMigration1751223578383 } from './migrations/AddTypeColumnFromDocumentTableMigration-1751223578383';
import { InitialMigration1750507867331 } from './migrations/InitialMigration-1750507867331';

export const DATABASE_MIGRATIONS = [
    new AddBrandColumnToItemsTableMigration1751057246774(),
    new AddTypeColumnFromDocumentTableMigration1751223578383(),
    new InitialMigration1750507867331()
];
