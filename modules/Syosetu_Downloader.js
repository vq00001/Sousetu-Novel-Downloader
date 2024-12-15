const puppeteer = require('puppeteer');
const fs = require('fs');

let file_path = "./Downloads";

// funcion para formatear el texto ruby de los archivos html
function formatRubyHtml(str){
    
    let final = str.replaceAll('<ruby>', " ");
    let breakpoint = /<rp>|<\/rp><rt>|<\/rt>|<\/rp><\/ruby>/g;

    final = final.replace(breakpoint, '');
    return final;
}


function deletePageFoot(str){
    let final = str.replace(/(?<=<a).*?(?=a>)/, '');
    final = final.replace("<aa>", '');  
    return final;
}


// try {
//     // Updating with the New directory
//     process.chdir(file_path);
//     console.log("The path of the created file: " + process.cwd());

// } catch (err) {
//        // Printing error if any occurs
//        console.error("error occured while " + "changing directory: " + err);
// }


//arguments: code, start, finish, name #with both start and finish inclusive and code being the code of the novel in the webpage
async function download_novel(code, start, finish, name){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
        
    await page.goto(`https://ncode.syosetu.com/${code}/${start}/`);
    console.log(`Starting... \nDownloading chapters from ${start} to ${finish}`);
    console.log(`Number of chapters downloaded: ${finish - start + 1}`);
    
    const links = await page.$$("div.c-announce>a");
    const novelTitle = links[1];
    const novelTitleHandle = await novelTitle.getProperty("innerHTML");
    const novelTitleText = await novelTitleHandle.jsonValue();                                // novel title
    
    
    // const arcTitle = await page.$(".chapter_title");
    // const arcTitleHandle = await arcTitle.getProperty("innerHTML");
    // const arcTitleText = await arcTitleHandle.jsonValue();


    // start stream to write the file
    const writeStream = fs.createWriteStream(`${name}.txt`, {flags:'a'});
    const pathName = writeStream.path;

    console.log(`Novel Title: ${novelTitleText}`);
    //console.log(`Arc Title: ${arcTitleText}`);
    writeStream.write(`@${novelTitleText}\n\n`); // ${arcTitleText}
    
    for(let i = 0; i < finish - start + 1; i++){
        
        const title = await page.$(".p-novel__title");
        const titleHandle = await title.getProperty("innerHTML");
        const titleText = await titleHandle.jsonValue();

        const chapterNumObj = await page.$(".p-novel__number");
        const chapterNumHandle = await chapterNumObj.getProperty("innerHTML");
        
        let chapterNum = await chapterNumHandle.jsonValue();
        chapterNum = chapterNum.replace('<span class="novel_no_siori js-siori">&nbsp;</span>', '');

        const chapterNumberFinal = chapterNum.split('/')[0];
        console.log("Writing chapter: " + chapterNumberFinal);
        

        const novel = [];
        let arrLength = await page.$$(".js-novel-text p");
        
        //store all the p in an array
        for(let j = 1; j < arrLength.length + 1; j++){

            let step1 = arrLength[j - 1];
            let step2 = await step1.getProperty("innerHTML");
            let step3 = await step2.jsonValue();
            // let step1 = await page.$(`#L${j}`);
            // if(i == 1) {console.log(step1);}
            // 
            // let step2 = await step1.getProperty("innerHTML");
            // let step3 = await step2.jsonValue();

            step3 = formatRubyHtml(step3);
            if(step3 ===  "<br>"){
                step3 = "\n";
            }

            if(j > arrLength.length - 4){ step3 = deletePageFoot(step3);}
            novel.push(step3);      
        }
        
       
    
    // write the file content
        
        writeStream.write(`#${chapterNumberFinal} 「${titleText}」 \n\n`);
        novel.forEach(value => writeStream.write(`${value}\n`));
        writeStream.write("\n\n\n");
        

    // the finish event is emitted when all data has been flushed from the stream
        // writeStream.on('finish', () => {
        //     console.log(`wrote all the array data to file ${pathName}`);
        // });

    // handle the errors on the write process
        writeStream.on('error', (err) => {
            console.error(`There is an error writing the file ${pathName} => ${err}`)
        });

        
        await page.goto(`https://ncode.syosetu.com/${code}/${start + i + 1}/`)
    };
    
    // close the stream
    writeStream.end();
    
    await browser.close();  
    console.log("Finished script.")
}

export {download_novel};



// pdftk Ten_sura_arc_07.pdf cat 500-1 output That_Time_I_Got_Reincarnated_as_a_Slime_Arc_07.pdf
