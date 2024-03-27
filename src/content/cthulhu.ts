// クトゥルフ神話TRPGのダイス結果を集計する
export default function cthulhu(items:ChatItem[]) {

    // ダイスロール結果を取得
    const rolls = extractRolls(items);

    // 全体・キャラクターごとのサマリーを計算
    const persons = Array.from(new Set(rolls.map(value => value.person)));
    const summarries:{[key:string]:CthulhuSummary} = {};
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

    // 正規表現を組み立て
    const contentExpr = /(x(\d+)\s+)?((c|C)(c|C)(b|B)|1(d|D)100)&lt;=[0-9+\-*\/()]+\s+(.*)/;
    const dicerollExpr = /\(.+<=(\d+)\) ＞ (\d+) ＞ (.+)/g;

    // ダイスロール結果を格納する配列
    const rolls = new Array<CthulhuRoll>();

    // ダイスロールが行われたチャットを処理
    for(const item of items) {
        if(item.diceroll) {

            // 正規表現を掛ける
            const contentMatch = item.content.match(contentExpr);
            const dicerollMatch = [...item.diceroll.matchAll(dicerollExpr)];
            if(!contentMatch || dicerollMatch.length === 0) { continue; }

            // 判定回数・技能名・技能値を取得
            const count = contentMatch[2] ? parseInt(contentMatch[2]) : 1;
            const ability = contentMatch[8];
            const target = parseInt(dicerollMatch[0][1]);

            // 判定回数分結果を変換
            for(let x = 0; x < count; ++x) {
                const result = Number(dicerollMatch[x][2]);
                const roll:CthulhuRoll = {
                    person: item.person,
                    ability: ability,
                    target: target,
                    result: result,
                    status: result <= target ? 'success' : 'failure'
                };
                if(roll.status === 'success' && result <= 5) { roll.extra = 'critical' }
                if(roll.status === 'failure' && result >= 96) { roll.extra = 'fumble' }
                rolls.push(roll);
            }
        }
    }

    // ダイスロール結果を返す
    return rolls;
}

// サマリーを作る
function makeSummary(rolls:CthulhuRoll[], person?:string):CthulhuSummary {

    // ダイスロールをキャラクター名でフィルタリング
    if(person) { rolls = rolls.filter(value => value.person === person); }

    // ダイス目の統計を計算する
    const rollNum = rolls.length;
    const successNum = rolls.filter(value => value.status === 'success').length;
    const failureNum = rolls.filter(value => value.status === 'failure').length;
    const criticalNum = rolls.filter(value => value.extra === 'critical').length;
    const fumbleNum = rolls.filter(value => value.extra === 'fumble').length;

    const successRate = successNum / rollNum;
    const failureRate = failureNum / rollNum;
    const criticalRate = criticalNum / rollNum;
    const fumbleRate = fumbleNum / rollNum;

    const results = rolls.map(value => value.result);
    const average = results.reduce((p,c) => p + c) / rollNum;
    const standard = Math.sqrt(results.reduce((p,c) => p + Math.pow(c - average, 2)) / rollNum);

    // 作成したサマリーを返す
    return {rollNum,successNum,successRate,failureNum,failureRate,criticalNum,criticalRate,fumbleNum,fumbleRate,average,standard};

}