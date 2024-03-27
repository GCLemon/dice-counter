// エモクロアTRPGのダイス結果を集計する
export default function emoklore(items:ChatItem[]) {

    // ダイスロール結果を取得
    const rolls = extractRolls(items);

    // 全体・キャラクターごとのサマリーを計算
    const persons = Array.from(new Set(rolls.map(value => value.person)));
    const summarries:{[key:string]:EmokloreSummary} = {};
    summarries['TOTAL'] = makeSummary(rolls);
    for(const person of persons) {
        summarries[person] = makeSummary(rolls, person);
    }

    // 計算結果をJSONとして出力
    const blob = new Blob([JSON.stringify({rolls,summarries}, null, '  ')], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'result.json';
    link.click();
    URL.revokeObjectURL(url);
}

// ダイスロール結果を抽出する
function extractRolls(items:ChatItem[]) {

    // 成功数をステータスに変換する
    const status = (success:number):'fumble'|'failure'|'single'|'double'|'triple'|'miracle'|'catastroph' => {
        if(success >= 10) return 'catastroph';
        else if(success >= 4) return'miracle';
        else if(success === 3) return 'triple';
        else if(success === 2) return 'double';
        else if(success === 1) return 'single';
        else if(success === 0) return 'failure';
        else return 'fumble';
    }

    // 正規表現を組み立て
    const contentExpr = /(x(\d+)\s+)?[0-9+\-*\/()]*(d|D)(m|M)&lt;=[0-9+\-*\/()]+\s+(.*)/;
    const dicerollExpr = /\((\d+)DM<=(\d+)\) ＞ (\[(\d+,?)+\]) ＞ (\d+) ＞ 成功数(\d+) (.*)/g;

    // ダイスロール結果を格納する配列
    const rolls = new Array<EmokloreRoll>();

    // ダイスロールが行われたチャットを処理
    for(const item of items) {
        if(item.diceroll) {

            // 正規表現を掛ける
            const contentMatch = item.content.match(contentExpr);
            const dicerollMatch = [...item.diceroll.matchAll(dicerollExpr)];
            if(!contentMatch || dicerollMatch.length === 0) { continue; }

            // 判定回数・技能名・技能値を取得
            const count = contentMatch[2] ? parseInt(contentMatch[2]) : 1;
            const ability = contentMatch[5];
            const target = parseInt(dicerollMatch[0][2]);
            const dicenum = parseInt(dicerollMatch[0][1]);

            // 判定回数分結果を変換
            for(let x = 0; x < count; ++x) {
                const result = [...dicerollMatch[x][3].matchAll(/d+/)].map(value => parseInt(value[0]));
                const success = parseInt(dicerollMatch[x][5]);
                const roll:EmokloreRoll = {
                    person: item.person,
                    ability: ability,
                    target: target,
                    dicenum: dicenum,
                    result: result,
                    success: success,
                    status: status(success)
                };
                rolls.push(roll);
            }
        }
    }

    // ダイスロール結果を返す
    return rolls;
}

// サマリーを作る
function makeSummary(rolls:EmokloreRoll[], person?:string) {

    // ダイスロールをキャラクター名でフィルタリング
    if(person) { rolls = rolls.filter(value => value.person === person); }

    // ダイス目の統計を計算する
    const rollNum = rolls.length;
    const fumbleNum = rolls.filter(value => value.status === 'fumble').length;
    const failureNum = rolls.filter(value => value.status === 'failure').length;
    const singleNum = rolls.filter(value => value.status ==='single').length;
    const doubleNum = rolls.filter(value => value.status === 'double').length;
    const tripleNum = rolls.filter(value => value.status === 'triple').length;
    const miracleNum = rolls.filter(value => value.status ==='miracle').length;
    const catastrophNum = rolls.filter(value => value.status === 'catastroph').length;
    const hitNum = singleNum + doubleNum + tripleNum + miracleNum + catastrophNum;
    const errorNum = fumbleNum + failureNum;

    const fumbleRate = fumbleNum / rollNum;
    const failureRate = failureNum / rollNum;
    const singleRate = singleNum / rollNum;
    const doubleRate = doubleNum / rollNum;
    const tripleRate = tripleNum / rollNum;
    const miracleRate = miracleNum / rollNum;
    const catastrophRate = catastrophNum / rollNum;
    const hitRate = hitNum / rollNum;
    const errorRate = errorNum / rollNum;

    const successAverage = rolls.map(value => value.success).reduce((p,c) => p + c) / rollNum;

    // 作成したサマリーを返す
    return {rollNum,fumbleNum,fumbleRate,failureNum,failureRate,singleNum,singleRate,doubleNum,doubleRate,tripleNum,tripleRate,miracleNum,miracleRate,catastrophNum,catastrophRate,hitNum,hitRate,errorNum,errorRate,successAverage};
}