'use strict';

const archiver = require('archiver');
const { PassThrough } = require('stream');

function collectionToArray(collection, orderBy) {
  if (!collection) return [];

  const sortedCollection = orderBy && typeof collection.sort === 'function'
    ? collection.sort(orderBy)
    : collection;

  if (typeof sortedCollection.toArray === 'function') {
    return sortedCollection.toArray();
  }

  return Array.from(sortedCollection);
}

function serializeEntry(entry) {
  const result = {};

  if (entry.title) result.title = entry.title;
  if (entry.path) result.url = hexo.config.root + entry.path;
  if (entry._content) result.content = entry._content;
  if (entry.tags) result.tags = collectionToArray(entry.tags).map((tag) => tag.name);
  if (entry.categories) result.categories = collectionToArray(entry.categories).map((category) => category.name || category);
  if (entry['header-img']) result.header_img = entry['header-img'];
  if (entry.date) result.date = entry.date;

  return result;
}

function createZip(content, filename) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks = [];
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('data', (chunk) => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks)));
    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);
    archive.append(content, { name: filename });
    archive.finalize();
  });
}

hexo.extend.generator.register('zip-search', async function (locals) {
  const search = hexo.config.search;
  if (!search || !search.path || !search.zipPath || !search.versionPath) {
    return [];
  }

  const field = String(search.field || 'post').trim();
  const entries = [];

  if (field !== 'page') {
    entries.push(...collectionToArray(locals.posts, '-date').map(serializeEntry));
  }

  if (field !== 'post') {
    entries.push(...collectionToArray(locals.pages).map(serializeEntry));
  }

  const zipContent = await createZip(JSON.stringify(entries), search.path);

  return [
    { path: search.zipPath, data: zipContent },
    { path: search.versionPath, data: String(Date.now()) }
  ];
});
