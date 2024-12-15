import promptSync from 'prompt-sync';
const prompt = promptSync();

import {ask_novel_data, show_saved_novels} from './modules/record_handler.js';

// main menu
console.log('Main menu: \n 1. Download new novel\n 2. Download existing novel\n 3. Edit existing novel data\n 4. Exit')
let mode = prompt(" > ");

let mode_num = parseInt(mode);
while(isNaN(mode_num) || mode_num < 1 || mode_num > 4){
    console.clear();
    console.log('Main menu: \n 1. Download new novel\n 2. Download existing novel\n 3. Edit existing novel data\n 4. Exit')
    mode = prompt(" > ");
    mode_num = parseInt(mode);
}

switch(mode_num){
    case 1:
        ask_novel_data();
        break;
    case 2:
        // download existing novel
        show_saved_novels();
        break;
    case 3:
        // edit existing novel data
        break;
    case 4:
        // exit
        break;

    default:
        break;
}