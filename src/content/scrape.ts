export default async function scrape() {

    // 遅延処理を行う関数
    const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

    // ルームチャット要素を取得
    const chat = document.querySelector('#root > div > div.MuiDrawer-root.MuiDrawer-docked.sc-gsttTe.jpQNbE.css-oms1ax > div > ul');
    if(!chat) { throw new Error('Room chat open failed.'); }

    // チャットの一番上までスクロール
    while(chat.scrollTop !== 0) {
        chat.scrollTo(0, 0);
        await delay(500);
    }
    
    // チャットの内容を記録する配列を作成
    let elements = new Array<Element>();
    let prevtop = chat.scrollTop;

    // スクロールできなくなるまで要素を取得し続ける 
    while(true) {

        // 現在表示されている要素を取得して、記録できていないものを格納
        let height = 0;
        for(const item of chat.querySelectorAll(':scope > div > div > div')) {
            const index = Number(item.getAttribute('data-index'));
            if(!isNaN(index) && index >= elements.length) {
                elements.push(item);
                height += item.scrollHeight;
            }
        }

        // スクロールして、それ以上スクロールできなければ終わり
        chat.scrollBy(0, height);
        if(chat.scrollTop === prevtop) { break; }
        prevtop = chat.scrollTop;
        await delay(500);
    }
}