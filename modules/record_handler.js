import fs from 'fs';
import promptSync from 'prompt-sync';
const prompt = promptSync();
// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

class Arc_Format{

    static ARC = 'arc';
    static CHAPTER = 'chapter';
    static CUSTOM = 'custom';

    constructor(){}

    static get_arc_string(format, novel_start, novel_end){
        if (format.toLowerCase() === 'arc'){
            return "Arc ";
        }

        else if (format.toLowerCase() === 'chapter'){
            return `${novel_start}-${novel_end}`;
        }
    }
}


function save_novel_data(novel_code, novel_name, novel_start, novel_end, arc_format){  

    // Novel name: , Novel code:, Chapter download start: , Chapter download end:
    let data = `${novel_name},${novel_code},${novel_start},${novel_end},${arc_format}\n`;

    fs.appendFile('novel_data.txt', data, (err) => {
        if (err) throw err;
        console.log('Data has been saved');
    });
}


function ask_novel_data(){
    let novel_code = prompt('Novel code: ');
    let novel_name = prompt('Novel name: ');
    let novel_start = prompt('Chapter download start: ');

    novel_start = parseInt(novel_start);
    while(isNaN(novel_start)){
        novel_start = prompt('Chapter download start: ');
        novel_start = parseInt(novel_start);
    }

    let novel_end = prompt('Chapter download end: ');
    novel_end = parseInt(novel_end);
    while(isNaN(novel_end)){
        novel_end = prompt('Chapter download end: ');
        novel_end = parseInt(novel_end);
    }

    let arc_format = prompt('Arc format (arc/chapter/custom): ');

    while(arc_format.toLowerCase() !== 'arc' && arc_format.toLowerCase() !== 'chapter' && arc_format.toLowerCase() !== 'custom'){
        arc_format = prompt('Arc format (arc/chapter/custom): ');
    }


    let save_novel_prompt = prompt('Save novel data? (y/n): ');

    while(save_novel_prompt.toLowerCase() !== 'y' && save_novel_prompt.toLowerCase() !== 'n' && save_novel_prompt.toLowerCase() !== 'yes' && save_novel_prompt.toLowerCase() !== 'no'){
        save_novel_prompt = prompt('Save novel data? (y/n): ');
    }
    
    save_novel_prompt = save_novel_prompt.replaceAll(/[\s\n]/g, '');
    save_novel_prompt = save_novel_prompt.toLowerCase();
    
    if (save_novel_prompt === 'y' || save_novel_prompt === 'yes'){
        save_novel_data(novel_code, novel_name, novel_start, novel_end, arc_format);
    }
    download_novel(novel_code, novel_name, novel_start, novel_end, arc_format);


}

function show_saved_novels(){

    console.log(" Novel name | Last chapter downloaded");
    let data = fs.readFileSync('novel_data.txt', 'utf-8');

    let lines = data.split('\n');

    for (let line of lines) {

        let name = line.split(',')[0];
        let last = line.split(',')[3];        
        console.log(`${name} | ${last}`);
    }

    
}

export {ask_novel_data, show_saved_novels};

