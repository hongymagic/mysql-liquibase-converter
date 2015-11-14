import program from 'commander';
import packageInfo from '../package.json'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import TableFormatter from './table-formatter';
import fs from 'fs';

let file;
let outputDirectory;

program
    .version(packageInfo.version)
    .usage('[options] <sqlFile> [outputLocation]')
    .arguments('<sqlFile> [outputLocation]')
    .option('-d, --includeData', 'include table data', false)
    .action((sqlFile, outputLocation) => {
        outputDirectory = outputLocation;
        file = sqlFile;
    });

program.parse(process.argv);

outputDirectory = outputDirectory || './output';

if (!file) {
   console.error('no sqlFile provided');
   process.exit(1);
}

let options = {
    includeData: program.includeData
};

let reader = new Reader(options);
let formatters = new SqlFormatter();
let converter = new Converter(reader, formatters);

formatters['table'] = new TableFormatter();

let contents = fs.readFileSync(file, 'utf8');
converter.createFiles(contents, outputDirectory);
