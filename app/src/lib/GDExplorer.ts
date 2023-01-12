import type { GameData } from './GD.types';

interface NFolderEntries {
	type: string;
	entry: string;
}

class GDExplorer {
	/**
	 * @description .json full path
	 */
	public gameFilePath = '';
	/**
	 * @description .json game file name
	 */
	public gameFile = '';
	/**
	 * @description .json game file path
	 */
	public gamePath = '';
	/**
	 * @description .json parsed content
	 */
	public gameData = {};
	/**
	 * @description open system file picker to select .json game file
	 */
	public async pickGameFile(): Promise<boolean> {
		let entries = await Neutralino.os.showOpenDialog('Open a file', {
			multiSelections: false,
			filters: [{ name: 'game.json', extensions: ['json'] }]
		});
		if (!entries.length) return false;
		this.gameFilePath = entries[0];
		this.setupPaths();
		return true;
	}
	public setupPaths(): void {
		let open = this.gameFilePath;
		let t = open.split('/');
		let file = t[t.length - 1];
		let path = open.replace(file, '');
		// console.log('You have selected:', path, file);
		this.gameFile = file;
		this.gamePath = path;
	}
	/**
	 * @description read .json game file and parse as json to `GDExplorer.gameData`
	 */
	public async readGameFile(): Promise<any> {
		let data = await Neutralino.filesystem.readFile(this.gameFilePath);
		data = JSON.parse(data);
		if (!data.hasOwnProperty('gdVersion'))
			return {
				error: 'Select a valid GDevelop game file'
			};
		this.gameData = data;
		return {
			success: true
		};
	}
	/**
	 * @description read game folder
	 */
	public async readFolder(subfolder = '') {
		// console.log(this.gamePath+subfolder);
		let entries = await Neutralino.filesystem.readDirectory(this.gamePath + subfolder);
		return entries as [NFolderEntries];
	}
	/**
	 * @description get game data
	 */
	public getData() {
		return this.gameData as GameData;
	}
	/**
	 * @description get game data properties
	 */
	public getProperties() {
		let d = this.gameData as GameData;
		return d.properties;
	}
	/**
	 * Functions
	 */
	public fullFolders: any = [];
	public async readFullFolder(folderPath = ['.']){
		let fp = folderPath.join('/');
		let content = await this.readFolder(fp);
		let now = {
			entry: fp,
			files: [] as any
		};
		if (folderPath.length == 1) this.fullFolders = []; //reset

		for (let index = 0; index < content.length; index++) {
			const element = content[index];
			if (
				element.type === 'DIRECTORY' &&
				element.entry != '!Trash' &&
				element.entry != '.' &&
				element.entry != '..'
			) {
				let tmp = [...folderPath] as any;
				tmp.push(element.entry);
				await this.readFullFolder(tmp);
			} else if (element.type == 'FILE') {
				now.files.push(element);
			}
		}

		if (now.files.length) this.fullFolders.push(now);
		return this.fullFolders;
	}

	public resourceCleanerList: any = [];
	public async resCleaner() {
		await this.readFullFolder();
	}

	public async resourceCleaner(folderPath = ['.']) {
		let fp = folderPath.join('/');
		let content = await this.readFolder(fp);
		let now = {
			entry: fp,
			files: [] as any
		};
		if (folderPath.length == 1) this.resourceCleanerList = [];

		let resourceList = this.getData().resources.resources;

		for (let index = 0; index < content.length; index++) {
			const element = content[index];
			let check = [];
			if (
				element.type === 'DIRECTORY' &&
				element.entry != '!Trash' &&
				element.entry != '.' &&
				element.entry != '..'
			) {
				let tmp = [...folderPath] as any;
				tmp.push(element.entry);
				await this.resourceCleaner(tmp);
			} else if (element.type != 'DIRECTORY') {
				let pass = true;
				let gdpath = folderPath.length == 1 ? '' : folderPath.join(`\\`).replace('.\\', '');
				let gdname = element.entry;
				if (gdpath) gdname = `${gdpath}\\${element.entry}`;
				check = resourceList.filter((e: any) => e.name === gdname);
				if (check.length) pass = false;
				if (element.entry == this.gameFile + '.autosave') pass = false;
				if (element.entry == this.gameFile) pass = false;
				if (element.entry.endsWith('.json')) pass = false;
				// pass = true; //force bypass
				if (pass) now.files.push(element);
			}
		}
		if (now.files.length) this.resourceCleanerList.push(now);
		return this.resourceCleanerList;
	}

	public async moveToTrash(folderList:any) {
		const trash = this.gamePath + '!Trash';
		try {
			await Neutralino.filesystem.createDirectory(trash);
		} catch (error) {
			console.log(error);
		}
		for (let index = 0; index < folderList.length; index++) {
			const element = folderList[index];
			const entry = element.entry == '.' ? this.gamePath : element.entry.replace('./', this.gamePath)+'/';
			const tmp = element.entry.replace('.', trash)+'/';//replace original location to trash+folder_structure+'/'
			const t = element.entry.split('/');//folder structure
			const tt: any = [];
			console.log(entry)
			for (let ii = 1; ii < t.length; ii++) {
				tt.push(t[ii]);
				try {
					//create structure
					await Neutralino.filesystem.createDirectory(trash + '/' + tt.join('/'));
				} catch (error) {
					// console.log(error);
				}
			}
			for (let iii = 0; iii < element.files.length; iii++) {
				const file = element.files[iii];
				await Neutralino.filesystem.moveFile(entry+file.entry, tmp+file.entry);
			}
		}
		return;
	}
}

export default new GDExplorer();
