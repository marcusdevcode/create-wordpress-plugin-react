import { text,confirm,stream,spinner,note } from '@clack/prompts';
import capitalize from "@colakit/capitalize";
import { readFileSync,readdirSync,lstatSync,existsSync,mkdirSync,writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'path';
const cwd = process.cwd()
const nameToSlug = (meaning,space_replacer= "") => {
	return getSlug(meaning).replace(new RegExp("(\\s|\\t)",'g'),space_replacer)
}

function replace_data(data, replaceText) {
	Object.keys(replaceText).map((search) => {
		const replace = replaceText[search];
		data = data.replace(new RegExp(search,'g'),replace);
	})
	return data;
}

const scan_and_replace = (__dirname, replaceText,root)  => {
	const files_and_folders = readdirSync(__dirname);
	const isExists          = existsSync(root);
	console.log(isExists," isExists");
	if(!isExists){
		mkdirSync(root);
	}
	return files_and_folders.map(async (file, index) => {
		const PathDir     = path.join(__dirname, file);
		const lstatsync   = lstatSync(PathDir);
		let rootFileOrDir = path.join(root, file);
		if (file.indexOf("plugin-slug") > -1) {
			let slug = replaceText["plugin-slug"];
			file = file.replace(new RegExp("plugin-slug", 'g'), slug);
			rootFileOrDir = path.join(root, file);
		}
		if (lstatsync.isDirectory()) {
			console.log(PathDir," PathDir");
			console.log(rootFileOrDir," rootFileOrDir");
			scan_and_replace(PathDir, replaceText, rootFileOrDir);
		}
		if (lstatsync.isFile()) {
			let data = readFileSync(PathDir, 'utf8');
			data = replace_data(data, replaceText);
			await writeFileSync(rootFileOrDir, data);
		}
	})
}

const nameYourPlugin = async (text) => {
	const plugin_name = await text({
		message: 'What is your plugin name?',
		placeholder: ' My Awesome Plugin Name',
		initialValue: '',
	});
	if(typeof plugin_name === "string"){
		const PluginSlug = nameToSlugCapitalize(plugin_name);
		const PLUGIN_SLUG = nameToSlug(plugin_name,"_");
		const PLUGINMINUSSLUG = nameToSlug(plugin_name,"-").toLowerCase();
		const shouldContinue = await confirm({
			message: `Plugin folder will be ${PluginSlug}. Do you want to continue?`,
		});
		if(!shouldContinue){
			return await nameYourPlugin(text);
		}
		const replaceText = {
			"Plugin_Name" : plugin_name,
			"PluginSlug"  : PluginSlug,
			"PLUGIN_SLUG" : PLUGIN_SLUG.toUpperCase(),
			"plugin-slug" : PLUGINMINUSSLUG,
		}
		const PathDir = fileURLToPath(new URL('./template', import.meta.url))
		const root    = path.join(cwd, PLUGINMINUSSLUG);
		const s = spinner();
		s.start('Creating plugin!');
		scan_and_replace(PathDir,replaceText,root);
		s.stop('Plugin created!');
		stream.success((function *() { yield 'Success!'; })());
		const nextSteps = `cd ./${PLUGINMINUSSLUG} && composer install && cd ./assets && npm install && npm start`;
		note(nextSteps, 'Next steps.');
		process.exit(0);
	}
	return false;
}
const getSlug = (meaning) => {
	const regex = /\w+|\s|\t/g;
	let meaning_name = "";
	let m;
	while ((m = regex.exec(meaning)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			meaning_name += match;
		});
	}
	return meaning_name;
}
const nameToSlugCapitalize = (meaning) => {
	let meaning_name = getSlug(meaning).replace(new RegExp("(\\s|\\t)",'g'),"");
	return capitalize(meaning_name);
}
await nameYourPlugin(text);
