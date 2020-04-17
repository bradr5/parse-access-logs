const { spawn, spawnSync } = require('child_process');

describe('parse', () => {
  it('should display \'Saved!\' with a file location given when successful common access logs supplied', (done) => {
    const parse = spawn('node', ['parse.js', 'tests/mock-logs/access-common.log']);
    const chunks = [];
    parse.stdout.on('data', (chunk) => chunks.push(chunk));
    parse.stdout.on('end', () => {
      const output = Buffer.concat(chunks).toString();
      expect(output).toContain('Saved!\nFile location: ./access-log-data.csv');
      done();
    });
  });

  it('should display \'Saved!\' with a file location given when successful combined access logs supplied', (done) => {
    const parse = spawn('node', ['parse.js', 'tests/mock-logs/access-combined.log']);
    const chunks = [];
    parse.stdout.on('data', (chunk) => chunks.push(chunk));
    parse.stdout.on('end', () => {
      const output = Buffer.concat(chunks).toString();
      expect(output).toContain('Saved!\nFile location: ./access-log-data.csv');
      done();
    });
  });

  it('should display missing argument', () => {
    const parse = spawnSync('node', ['parse.js']);
    const errorText = parse.stderr.toString().trim();
    expect(errorText).toContain('Error: missing argument');
  });

  it('should display invalid file path', () => {
    const parse = spawnSync('node', ['parse.js', 'does-not-exist.abc']);
    const errorText = parse.stderr.toString().trim();
    expect(errorText).toContain('Error: ENOENT: no such file or directory');
  });
});
