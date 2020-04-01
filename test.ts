import * as common from "./common/common";
import * as tinyuntils from "./common/tinyUntils";

async function  test(){
    let list = common.getOneDirList();
    console.log(list);
    tinyuntils.automaticChangeKey(list);
}

test();
