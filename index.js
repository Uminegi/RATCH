let state;//現在の状態を示す番号
let mem;//記憶時間のテキストボックス
let st_b;//スタートボタン
let stop_b;//止めるボタン
let now_st_b;//すぐに始めるボタン
let last_bl;//最後の2枚のときに表示されるブロック
let last_bt;//最後の2枚のときに表示されるボタン
let now_st = false;//すぐに始めるかどうか
let memorize;//記憶中に表示される要素
let fin_bl;//終わった後に表示されるブロック
let last;//最後の2枚の前で表示される
let last_flag;
let flag;//旗の画像
let mem_time_en;//記憶時間のエントリー
let to_first_bt;//最初に戻るボタン
let loading;//ロード中の表示
var can_read = true;//読み上げを停止する
var read_next = true;
var now_time;//現在の時間←多分使わない?
var voice_time;//音声の時間をミリ秒で入れる変数
var mem_st;//記憶時間初まったタイミングの時間
var karuta_v;//流す音声が入る
var next_flag = false;//"つづけます"を読むか否か
var next_v;//"つづけます"の音声が入る
var next_time;//"つづけます"音声の再生時間
var first_shot = true;//無限ループ中に一回だけやる処理
var last_2_shot = true;//最後の二枚の処理で一回だけやる処理
var read_num;//読む札の番号
var read_time;//読んだ瞬間の時間
var mem_time;//記憶時間
var uniqueNumbers;//重複無しの数を入れるための変数
let now = new Date();//時間処理を使用するための宣言
var last_read = false;
var interval_id;//インターバルのID
var explanation;
let test_b;//テスト用ボタン
let maintenance;
let maintenance_time = true;//メンテナンス中はtureにする
let reader = 0;
let sounds = Array.from({ length: 47 }, (_, i) => i);
let sounds_time = Array.from({ length: 47 }, (_, i) => i);
let ma_sound;
let canStart = 0;//全部のロードが終わったら始めることができるようにする
//canStart == sounds.length + 1で始まる
let canStartFirst = true;

const v_name = [
    "r_n"
];//読み上げる人
const file_names = [//役札1,2,10,13,44,45　ま札:30　"つづけます":46
    "あ.mp3", "い.mp3", "う.mp3", "え.mp3", "お.mp3",
    "か.mp3", "き.mp3", "く.mp3", "け.mp3", "こ.mp3",
    "さ.mp3", "し.mp3", "す.mp3", "せ.mp3", "そ.mp3",
    "た.mp3", "ち.mp3", "つ.mp3", "て.mp3", "と.mp3",
    "な.mp3", "に.mp3", "ぬ.mp3", "ね.mp3", "の.mp3",
    "は.mp3", "ひ.mp3", "ふ.mp3", "へ.mp3", "ほ.mp3",
    "ま.mp3", "み.mp3", "む.mp3", "め.mp3", "も.mp3",
    "や.mp3", "ゆ.mp3", "よ.mp3",
    "ら.mp3", "り.mp3", "る.mp3", "れ.mp3", "ろ.mp3",
    "わ.mp3", "を.mp3", "ん.mp3",
    "つづけます.mp3"
];

window.onload = function () {
    explanation = document.getElementById("explanation");
    mem = document.getElementById("mem");//記憶時間中に表示されるブロック
    mem_time_en = document.getElementById("mem_time");//記憶時間のブロック
    st_b = document.getElementById("st-button");//記憶時間を始めるボタン
    stop_b = document.getElementById("stop_bt");//止めるボタン
    now_st_b = document.getElementById("now_st_button");//すぐに始めるボタン
    memorize = document.getElementById("memorizing");//記憶時間中に表示されるブロック
    last_bl = document.getElementById("last");//最後の2枚のときに表示されるブロック
    last_bt = document.getElementById("last_bt");//最後の2枚のときに表示されるボタン
    flag = document.getElementById("flag");//赤い旗の画像
    fin_bl = document.getElementById("finish");//終わった後に表示されるブロック
    test_b = document.getElementById("test_bt");//テスト用ボタン
    maintenance = document.getElementById("testTime");//メンテナンス時のやつ
    loading = document.getElementById("loading")
    console.log(sounds);
}

//役札やま札の確認
function check(nums, yaku_l, yaku_s, ren) {
    for (let i = nums.length - yaku_l - 1; i < nums.length; i++) {
        var num = nums[i];
        if (num == 1 || num == 2 || num == 10 || num == 13 || num == 44 || num == 45 || num == 30) {
            console.log("役札が最後の方に含まれています");
            return true;
        }
    }
    for (let i = yaku_s; i >= 0; i--) {
        var num = nums[i];
        if (num == 1 || num == 2 || num == 10 || num == 13 || num == 44 || num == 45 || num == 30) {
            console.log("やく札が最初の方に含まれています");
            return true;
        }
    }

    if (ren) {
        yaku = false;//やく札が連続しているか確認
        for (let i = 0; i < nums.length; i++) {
            var num = nums[i];
            if (num == 1 || num == 2 || num == 10 || num == 13 || num == 44 || num == 45 || num == 30) {
                if (yaku) {
                    console.log("やく札が連続しています");
                    return true;
                } else {
                    yaku = true;
                }
            } else {
                yaku = false;
            }
        }
    }
    return false;
}


function get_time() {
    now = new Date();
    return now.getTime();
}
//実際に動く部分
function read() {
    if (canStart == sounds.length + 1 && canStartFirst) {
        loading.style.display = "none";
        memorize.style.display = "block";
        canStartFirst = false;
    }
    if (now_st && !(canStartFirst)) {
        if (first_shot) {//最初の1回だけ
            memorize.style.display = "none";
            if (maintenance_time) {
                //test_b.style.display = "block";
            }
            //karuta_v = new Audio("./sound/" + v_name[0] + "/" + file_names[30]);//はじめはま札を読む
            ma_sound.play();//流す処理
            read_time = get_time();//一時的に現在の時間を入れる
            voice_time = sounds_time[30];//初期値として100秒を入れる
            /*karuta_v.addEventListener('loadedmetadata', function () {
                voice_time = Math.trunc(karuta_v.duration * 1000);
                read_time = get_time();//読んだ瞬間の時間を取得
            });*/
            read_num = 0;//初期値は0、テストのときは値を変えるので戻すのを忘れないように
            next = uniqueNumbers[read_num];
            flag.style.display = "block";
            stop_b.style.display = "block";
            first_shot = false
        }

        if (read_next) {//次の札を読んでも良いときの処理
            if (last_flag) {//最後の二枚のとき
                if (last_2_shot) {
                    flag.style.display = "none";
                    stop_b.style.display = "none";
                    last_bl.style.display = "block";
                    last_bt.style.display = "block";
                    last_2_shot = false;
                }
                if (last_read) {
                    if (next == uniqueNumbers[45]) {
                        clearInterval(interval_id);//ループを終了する
                        fin();//終了時の処理
                        return;
                    }
                    //karuta_v = new Audio("./sound/" + v_name[0] + "/" + file_names[next]);
                    sounds[next].play();//流す処理
                    read_time = get_time();//一時的に現在の時間を入れる
                    voice_time = sounds_time[next];//初期値として100秒を入れる
                    /*karuta_v.addEventListener('loadedmetadata', function () {
                        voice_time = Math.trunc(karuta_v.duration * 1000);
                        read_time = get_time();//読んだ瞬間の時間を取得
                        next = uniqueNumbers[read_num];
                        read_num = read_num + 1;
                    });*/



                }

            } else {
                if (next_flag) {//つづけますのとき
                    next = 46;
                    read_num = read_num - 1;
                    next_flag = false;
                }
                //karuta_v = new Audio("./sound/" + v_name[0] + "/" + file_names[next]);
                sounds[next].play();//流す処理
                read_time = get_time();//一時的に現在の時間を入れる
                voice_time = sounds_time[next];//初期値として100秒を入れる
                /*karuta_v.addEventListener('loadedmetadata', function () {//コールバック関数
                    voice_time = Math.trunc(karuta_v.duration * 1000);
                    read_time = get_time();//読んだ瞬間の時間を取得
                });*/
                read_num = read_num + 1;
                next = uniqueNumbers[read_num]
                if (read_num == 44) {
                    last_flag = true;//最後の二枚の処理を行う
                    next = 30;

                }

            }
            read_next = false;
        } else {

            if (read_time + voice_time + 1700 <= get_time()) {//次の札が読める状態だったら
                if (can_read) {
                    read_next = true;
                } else {
                    next_flag = true;
                }
            }
        }
    } else {
        if (mem_st + mem_time <= get_time()) {
            now_st = true;
        }
    }

}

//終了時の処理
function fin() {
    last_bl.style.display = "none";
    fin_bl.style.display = "block";

}

//初期化の処理
function init_karuta(reader_num) {
    //変数の初期化とか
    read_next = false;
    now_st = false
    first_shot = true;
    last_2_shot = true;
    last_flag = false;//最後の二枚のフラグ
    last_read = false;//最後の二枚を読んでも良いかのフラグ
    ma_sound = new Audio("./sound/" + v_name[reader_num] + "/" + file_names[30])
    ma_sound.play().then(() => {
        ma_sound.pause();
        ma_sound.currentTime = 0;
        canStart++;
    });
    ma_sound.addEventListener("loadedmetadata", function () {
        sounds_time[30] = Math.trunc(ma_sound.duration * 1000);
    })
    for (let i = 0; i < sounds.length; i++) {
        sounds[i] = new Audio("./sound/" + v_name[reader_num] + "/" + file_names[i])
        sounds[i].play().then(() => {
            sounds[i].pause();
        }).then(() => {
            sounds[i].currentTime = 0;
            console.log(i);
            canStart++;
        }).catch(function () {
            console.log("fail!!")
        });
        if (i == 30) {
            continue;
        }
        sounds[i].addEventListener('loadedmetadata', function () {
            sounds_time[i] = Math.trunc(sounds[i].duration * 1000);

        });
    }
    mem_st = get_time();//記憶開始のタイミングの時間
}
//始めるボタンを押したときの処理
function memo() {

    mem_time = mem_time_en.value * 1000 * 60;//記憶時間をミリ秒で取得
    mem.style.display = "none";
    st_b.style.display = "none";
    loading.style.display = "block";
    //memorize.style.display = "block";
    explanation.style.display = "none";

    init_karuta(reader);
    do {//
        var numbers = Array.from({ length: 46 }, (_, i) => i);
        var shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
        uniqueNumbers = shuffledNumbers.slice(0, 46);
    } while (check(uniqueNumbers, 5, 3, true));//最後の5枚に役札、ま札が読まれない,最初の2枚にま札が読まれない
    console.log(uniqueNumbers);




    interval_id = setInterval(read, 20);//0.02秒ごとに繰り返す処理
}

//止めるボタンを押したときの処理
function stop() {

    if (!can_read) {
        stop_b.value = "止める";
        can_read = true;
        flag.style.opacity = 0;

    } else {
        stop_b.value = "続ける";
        can_read = false;
        flag.style.opacity = 1;
    }
}

//すぐに始めるボタンを押したときの処理
function start() {
    now_st = true;
}

function last_2_cards() {//最後の二枚のときのボタン
    last_bt.style.display = "none";
    last_read = true;
}

function to_first() {//初めの状態に戻る
    fin_bl.style.display = "none";
    mem_time_en.value = 3;
    mem.style.display = "block";
    st_b.style.display = "block";
    explanation.style.display = "block";
}

function test() {
    console.log("test");
}