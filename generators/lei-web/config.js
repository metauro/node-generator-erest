const dependencies = [
  '@leizm/web',
  'erest',
  'ioredis',
  'lodash',
  'mysql',
  'pino',
  'pino-pretty',
  'squel',
  'uuid',
  'js-yaml',
];

const dependenciesTS = [
  '@types/ioredis',
  '@types/js-yaml',
  '@types/lodash',
  '@types/mysql',
  '@types/node',
  '@types/pino',
  '@types/uuid',
  '@types/debug',
];

const devDependencies = ['chai', 'debug', 'mocha', 'prettier', 'supertest', 'ts-node', 'typescript'];

const devDependenciesTS = ['@types/chai', '@types/mocha', '@types/prettier'];

exports.getTSDeps = () => {
  return [].concat(dependencies, dependenciesTS);
};

exports.getTSDevDeps = () => {
  return [].concat(devDependencies, devDependenciesTS);
};

exports.getJSDeps = () => {
  return dependencies;
};

exports.getJSDevDeps = () => {
  return devDependencies;
};
