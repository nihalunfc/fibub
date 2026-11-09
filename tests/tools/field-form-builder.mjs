// #827 field form builder
export const path = '/science/field-form-builder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ffb';
  const ctx = page.context();
  await ctx.grantPermissions(['geolocation'], { origin: BASE });
  await ctx.setGeolocation({ latitude: 51.5007292, longitude: -0.1246254, accuracy: 7.5 });
  await page.goto(`${BASE}/science/field-form-builder/`); await page.waitForTimeout(400);
  await page.evaluate(() => { localStorage.removeItem('fibub-field-form-v1'); localStorage.removeItem('fibub-field-form-v1-on'); }); await page.reload(); await page.waitForTimeout(400);
  check(!(await page.isChecked(`${R} .ff-keep`)), 'field form: keep box off at first');
  const box = (k) => `${R} .ff-in[data-key="${k}"]`;
  check((await page.textContent(`${R} .ff-ftitle`)) === 'Roadside pollinator count' && (await page.locator(`${R} .ff-in`).count()) === 9, 'field form: example form ready to fill');
  // Empty save: required fields flagged
  await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-rmsg`)) === 'Not saved: 4 fields need attention.' && (await page.textContent(`${box('site')} .ff-e`)) === 'Required.', 'field form: required fields');
  // Fill a record
  await page.fill(`${box('site')} textarea`, 'Verge A');
  await page.fill(`${box('when')} input`, '2026-06-14T11:20');
  await page.click(`${box('location')} .ff-get`); await page.waitForTimeout(400);
  check((await page.inputValue(`${box('location')} .ff-lat`)) === '51.5007292' && (await page.inputValue(`${box('location')} .ff-lon`)) === '-0.1246254' && (await page.inputValue(`${box('location')} .ff-acc`)) === '7.5' && (await page.textContent(`${box('location')} .ff-gstat`)).startsWith('Location found, accurate to about 7.5 m'), 'field form: location on tap');
  await page.fill(`${box('temperature')} input`, '50');
  await page.check(`${box('sky')} input[value="Sunny"]`);
  await page.check(`${box('groups')} input[value="Bumblebees"]`); await page.check(`${box('groups')} input[value="Hoverflies"]`);
  await page.fill(`${box('count')} input`, '17');
  await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${box('temperature')} .ff-e`)) === 'The largest allowed value is 45 °C.' && (await page.textContent(`${R} .ff-rmsg`)).startsWith('Not saved: 1 field'), 'field form: range check');
  await page.fill(`${box('temperature')} input`, '21.5');
  await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-rmsg`)) === 'Record 1 saved. It is only on this page until you tick “Keep the form and records in this browser” under Records.' && (await page.textContent(`${R} .ff-n`)) === '(1)' && (await page.inputValue(`${box('site')} textarea`)) === '', 'field form: record saved and form cleared');
  // Second record, typed location absent, Now button
  await page.fill(`${box('site')} textarea`, 'Gate, "north"');
  await page.click(`${box('when')} button`);
  check(/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(await page.inputValue(`${box('when')} input`)), 'field form: Now button');
  await page.check(`${box('sky')} input[value="Overcast"]`); await page.fill(`${box('count')} input`, '3');
  await page.fill(`${box('location')} .ff-lat`, '95'); await page.fill(`${box('location')} .ff-lon`, '1');
  await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${box('location')} .ff-e`)) === 'Latitude runs from -90 to 90.', 'field form: typed latitude checked');
  await page.click(`${box('location')} button:has-text("Clear")`);
  await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-rmsg`)).startsWith('Record 2 saved.'), 'field form: record without a location');
  // Records view and exports
  await page.click(`${R} .ff-tabs [data-v=records]`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-rcount`)) === '2 records.' && (await page.locator(`${R} .ff-tab tbody tr`).count()) === 2 && (await page.textContent(`${R} .ff-tab tbody tr:first-child`)).includes('51.50073, -0.12463 ±7.5 m'), 'field form: records table');
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return [d.suggestedFilename(), readFileSync(f, 'utf8')]; };
  { const [n, t] = await dl(`${R} .ff-csv`, 'ff.csv'); const lines = t.replace(/^\ufeff/, '').split('\r\n');
    check(/^Roadside-pollinator-count-\d{4}-\d\d-\d\d\.csv$/.test(n) && lines[0] === 'record,site,when,location_lat,location_lon,location_accuracy_m,location_time,temperature_c,sky,groups,count,photo,notes,saved' && lines[1].startsWith('1,Verge A,2026-06-14T11:20,51.5007292,-0.1246254,7.5,') && lines[1].includes('Z,21.5,Sunny,Bumblebees; Hoverflies,17,,,') && lines[2].startsWith('2,"Gate, ""north""",'), 'field form: CSV export'); }
  { const [n, t] = await dl(`${R} .ff-geo`, 'ff.geojson'); const g = JSON.parse(t);
    check(n.endsWith('.geojson') && g.type === 'FeatureCollection' && g.features.length === 1 && g.features[0].geometry.coordinates.join(',') === '-0.1246254,51.5007292' && g.features[0].properties.count === 17 && (await page.textContent(`${R} .ff-emsg`)).includes('1 without a location left out'), 'field form: GeoJSON export'); }
  await page.check(`${R} .ff-keepun`);
  { const [, t] = await dl(`${R} .ff-geo`, 'ff2.geojson'); const g = JSON.parse(t); check(g.features.length === 2 && g.features[1].geometry === null, 'field form: GeoJSON with unlocated records'); }
  // Edit a record
  await page.click(`${R} .ff-tab button[aria-label="Edit record 2"]`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-ftitle`)).endsWith('editing record 2') && (await page.inputValue(`${box('count')} input`)) === '3' && (await page.isChecked(`${box('sky')} input[value="Overcast"]`)), 'field form: edit loads the record');
  await page.fill(`${box('count')} input`, '4'); await page.click(`${R} .ff-rsave`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-rmsg`)) === 'Record 2 updated.', 'field form: record updated');
  check(await page.evaluate(() => localStorage.getItem('fibub-field-form-v1') === null), 'field form: nothing saved until the box is ticked');
  await page.click(`${R} .ff-tabs [data-v=records]`); await page.check(`${R} .ff-keep`); await page.waitForTimeout(50);
  // Kept after a reload
  await page.reload(); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .ff-n`)) === '(2)', 'field form: records kept in this browser');
  // Design: add a field, bad key, range
  await page.click(`${R} .ff-tabs [data-v=design]`);
  await page.selectOption(`${R} .ff-newtype`, 'number'); await page.click(`${R} .ff-add`); await page.waitForTimeout(80);
  await page.fill(`${R} .ff-fd >> nth=9 >> .ff-label`, 'Wind speed');
  check((await page.inputValue(`${R} .ff-fd >> nth=9 >> .ff-key`)) === 'wind_speed', 'field form: column name from the label');
  await page.fill(`${R} .ff-fd >> nth=9 >> .ff-key`, 'Wind Speed'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .ff-ferr`)).includes('only lower-case letters'), 'field form: bad column name');
  await page.fill(`${R} .ff-fd >> nth=9 >> .ff-key`, 'wind_kmh');
  await page.fill(`${R} .ff-fd >> nth=9 >> input[type=number] >> nth=0`, '10'); await page.fill(`${R} .ff-fd >> nth=9 >> input[type=number] >> nth=1`, '2'); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .ff-ferr`)).includes('smallest allowed value is above'), 'field form: bad range');
  await page.fill(`${R} .ff-fd >> nth=9 >> input[type=number] >> nth=0`, '0'); await page.fill(`${R} .ff-fd >> nth=9 >> input[type=number] >> nth=1`, '150');
  check(await page.isHidden(`${R} .ff-ferr`), 'field form: form fine again');
  { const [n, t] = await dl(`${R} .ff-save`, 'form.json'); const f = JSON.parse(t); check(n === 'Roadside-pollinator-count-form.json' && f.fields.length === 10 && f.fields[9].key === 'wind_kmh' && f.fields[9].max === 150, 'field form: save the form');
    await page.click(`${R} .ff-blank`); await page.waitForTimeout(50);
    check((await page.locator(`${R} .ff-fd`).count()) === 1, 'field form: new empty form');
    await page.setInputFiles(`${R} .ff-file`, { name: 'form.json', mimeType: 'application/json', buffer: Buffer.from(t) }); await page.waitForTimeout(150);
    check((await page.locator(`${R} .ff-fd`).count()) === 10 && (await page.inputValue(`${R} .ff-title`)) === 'Roadside pollinator count', 'field form: open a form file'); }
  await page.setInputFiles(`${R} .ff-file`, { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"fields":[{"type":"video"}]}') }); await page.waitForTimeout(150);
  check((await page.textContent(`${R} .ff-oerr`)).includes('unknown type "video"'), 'field form: bad form file');
  // Remove a field: old values note
  await page.click(`${R} .ff-fd >> nth=1 >> button[aria-label^="Remove"]`);
  await page.click(`${R} .ff-tabs [data-v=records]`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .ff-old`)).startsWith('2 records have values for fields that are no longer in the form'), 'field form: removed field note');
  // Storage off, delete all
  await page.uncheck(`${R} .ff-keep`); await page.waitForTimeout(50);
  check(await page.evaluate(() => localStorage.getItem('fibub-field-form-v1') === null), 'field form: untick removes the stored copy');
  await page.check(`${R} .ff-keep`); await page.waitForTimeout(50);
  await page.click(`${R} .ff-delall`); check((await page.textContent(`${R} .ff-delall`)) === 'Tap again to delete 2 records', 'field form: delete asks twice');
  await page.click(`${R} .ff-delall`); await page.waitForTimeout(50);
  check((await page.textContent(`${R} .ff-n`)) === '(0)' && (await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-field-form-v1')).recs.length)) === 0, 'field form: all records deleted');
  await page.evaluate(() => { localStorage.removeItem('fibub-field-form-v1'); localStorage.removeItem('fibub-field-form-v1-on'); });
};
