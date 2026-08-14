import fs from 'node:fs';
import path from 'node:path';
import {
  assertRequiredFields,
  deployRoot,
  projectPublicEntry,
  publicBaseUrl,
  requiredFields,
  readDeployArtifacts,
} from './roster-utils.mjs';

const outFile = path.resolve('src/generated-showcase-roster.json');
const sourceArtifacts = readDeployArtifacts();
assertRequiredFields(sourceArtifacts, 'deployArtifacts');

const generated = {
  provenance: {
    source: 'deploy-clone',
    deployRoot,
    publicBaseUrl,
    generationCommand: 'npm run generate:roster',
    generatedAt: new Date().toISOString(),
    preservedFields: requiredFields,
    note: 'Names/titles, folder slugs, and absolute hrefs are derived from the public deploy clone; public page omits local filesystem paths.',
  },
  entries: sourceArtifacts.map(projectPublicEntry),
};

fs.writeFileSync(outFile, `${JSON.stringify(generated, null, 2)}\n`);
console.log(`Generated ${generated.entries.length} public deploy roster entries at ${outFile}`);
