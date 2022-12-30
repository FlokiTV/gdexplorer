import type { GameData } from './GD.types';

interface NFolderEntries{
	type: string;
	entry:string;
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
	public async readFolder(subfolder = "") {
		// console.log(this.gamePath+subfolder);
		let entries = await Neutralino.filesystem.readDirectory(this.gamePath+subfolder);
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
	public resourceCleanerList:any = [];
	public async resourceCleaner(folderPath=['.']){
		let fp = folderPath.join('/')
		let content = await this.readFolder(fp);
		let now = {
			entry: fp,
			files: [] as any
		}
		let resourceList = this.getData().resources.resources
		if(folderPath.length == 1) this.resourceCleanerList = []
		for (let index = 0; index < content.length; index++) {
			const element = content[index];
			let check = []
			if(	element.type === "DIRECTORY"
				&& element.entry != "!Trash" 
				&& element.entry != "." 
				&& element.entry != ".."){
					let tmp = [...folderPath] as any
					tmp.push(element.entry)
					await this.resourceCleaner(tmp)
			}
			else if(element.type != "DIRECTORY"){
				let pass = true
				let gdpath = folderPath.length == 1? '' : folderPath.join(`\\`).replace(".\\", '')
				let gdname = element.entry;
				if(gdpath) gdname = `${gdpath}\\${element.entry}`;
				check = resourceList.filter((e:any) => e.name === gdname)
				if(check.length) pass = false
				if(element.entry == this.gameFile+".autosave") pass = false
				if(element.entry == this.gameFile) pass = false
				if(element.entry.endsWith(".json")) pass = false
				if(pass) now.files.push(element)
			}
		}
		if(now.files.length)
			this.resourceCleanerList.push(now)
		// this.resourceCleanerList = [...this.resourceCleanerList]
		return this.resourceCleanerList;
	}
}

export default new GDExplorer();
