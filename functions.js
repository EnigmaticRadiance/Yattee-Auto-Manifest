import fetch from 'node-fetch';
import { flag, code, name, countries } from 'country-emoji';
import { countryToRegion } from './countrycode.js';
import fs from 'fs';
export { getPipedInstances, getInvInstances, PipedVidious, updateInstances }

async function getPipedInstances() {
  try {
    const response = await fetch('https://piped-instances.kavin.rocks/');
    const body = await response.json();
    const PipedInstances = [];

    for (const arrayItem of body) {
      const locations = arrayItem.locations.split(', ');
      const instances = locations.map((location) => {
        const countryCode = code(location.trim());
        return {
          app: 'Piped',
          region: countryToRegion[countryCode],
          country: name(location.trim()),
          flag: flag(countryCode),
          url: arrayItem.api_url,
        };
      });
      PipedInstances.push(...instances);
    }

    const pipedresult = { updated: `${Date.now()}`, instances: PipedInstances };
    fs.writeFileSync('./webp/piped-instances.json', JSON.stringify(pipedresult));
  } catch (error) {
    console.error(error);
  }
}


async function getInvInstances() {
  try {
    const response = await fetch('https://api.invidious.io/instances.json');
    const body = await response.json();

    const InvInstances = body
      .filter(arrayItem => arrayItem[1].type === 'https')
      .map(arrayItem => ({
        app: 'Invidious',
        region: countryToRegion[arrayItem[1].region],
        country: name(arrayItem[1].flag),
        flag: arrayItem[1].flag,
        url: arrayItem[1].uri
      }));

    const Invresult = { updated: `${Date.now()}`, instances: InvInstances };
    fs.writeFileSync('./webp/invidious-instances.json', JSON.stringify(Invresult));
  } catch (error) {
    console.error(error);
  }
}

async function PipedVidious() {
  try {
    const file1 = await fs.promises.readFile('./webp/invidious-instances.json');
    const file2 = await fs.promises.readFile('./webp/piped-instances.json');
    const data1 = JSON.parse(file1);
    const data2 = JSON.parse(file2);

    const merged = {
      updated: `${Date.now()}`,
      instances: [...data1.instances, ...data2.instances],
    };

    await fs.promises.writeFile(
      './webp/piped-invidious-instances.json',
      JSON.stringify(merged)
    );
  } catch (error) {
    console.error(error);
  }
}

async function updateInstances() {
  const now = Date.now();
  try {
    const pipedUpdated = JSON.parse(fs.readFileSync('./webp/piped-instances.json')).updated;
    const invidiousUpdated = JSON.parse(fs.readFileSync('./webp/invidious-instances.json')).updated;
    const pipedInvidiousUpdated = JSON.parse(fs.readFileSync('./webp/piped-invidious-instances.json')).updated;

    // Check if the files have been updated less than an hour ago
    if (now - pipedUpdated < 60 * 60 * 1000 || now - invidiousUpdated < 60 * 60 * 1000 || now - pipedInvidiousUpdated < 60 * 60 * 1000) {
      return "Manifest files have been updated within the last hour, try again later";
    } else {
      await getPipedInstances();
      await getInvInstances();
      await PipedVidious();
      return "Files updated successfully";
    }
  } catch (error) {
    console.error(error);
    return "Error updating files";
  }
}
