//count, 用來計算source_str裡有多少個target_str
function string_count(source_str, target_str) {
    return source_str.split(target_str).length - 1
}


//replace_all, 取代javascript裡對應的replaceAll, 主因是不知為啥replaceAll很常自己消失, 所以自己刻一個replaceAll功能的function
function replace_all(source_str, target_str, replace_str) {
    let count = string_count(source_str, target_str);
    for (let i = 0; i < count; i++) {
        source_str = source_str.replace(target_str, replace_str);
    }
    return source_str
}


//檢查皇后座標是否正確
function check_nqueen(x, y, n){
    if (x.length != n || y.length != n){
        return false;
    }
    for (let i = 0; i < x.length; i++){
        for (let j = i + 1; j < x.length; j++){
            if (x[i] > n || x[i] < 0 || x[j] > n || x[j] < 0 || y[i] > n || y[i] < 0 || y[j] > n || y[j] < 0){
                return false;
            }
            let _x = parseFloat(x[i]) - parseFloat(x[j]);
            let _y = parseFloat(y[i]) - parseFloat(y[j]);
            let m = parseFloat(_y / _x);
            if (_x == 0.0 || _y == 0.0 || m == 1.0 || m == -1.0){
                return false;
            }
        }
    }
    return true;
}


//上傳檔案按鈕, 由於上傳檔案格式固定, 所以直接把要做的是直接寫在後面
async function upload_file(){
    let result_area = document.querySelector("#result");
    result_area.innerHTML = "";
    let file_list = document.querySelector("#html_uploader").files;
    for (let i = 0; i < file_list.length; i++){
        let file = file_list[i];
        let result = await read_file(file);
        if (!result){
            result_area.innerHTML += `${file.name}:<span style="color:rgb(255, 64, 0)">format have error</span><br>`;
        }
    }
}


//用FileReader來讀檔
async function read_file(file) {
    let result = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsText(file);
    });

    let token_array = [',', ' '];
    let token_index = -1;
    for (let i = 0; i < token_array.length; i++){
        if (string_count(result, token_array[i]) > 0){
            token_index = i;
            break;
        }
    }

    if (token_index != -1){
        if (token_index == 0){
            result = replace_all(result, " ", "");
        }else if (token_index == 1){
            result = replace_all(result, ",", "");
        }
        let temp_data = replace_all(result, "\r", "");
        temp_data = replace_all(temp_data, "\t", "");
        let split_data = temp_data.split(/\n/g);

        if (split_data.length != 0){
            x = [];
            y = [];
            let n = 0;
            let first_line = true;
            for (let i = 0; i < split_data.length; i++){
                let line = split_data[i];
                if (line.length > 0){
                    let split_line = line.split(token_array[token_index]);
                    if (i == 0){    //check first line is n
                        first_line = false;
                        if (split_line.length == 1){
                            n = parseInt(split_line[0]);
                            continue;
                        }
                    }

                    if (split_line.length == 2){    //if first line not is n, will is coordinate
                        x.push(parseInt(split_line[0]));
                        y.push(parseInt(split_line[1]));
                    }
                    else{
                        return false;
                    }
                }
            }
        }
    }else{
        return false;
    }
    n = x.length;
    let check_result = check_nqueen(x, y, n);
    let result_area = document.querySelector("#result");
    if (check_result){
        result_area.innerHTML += `${file.name}:<span style="color:blue">correct</span><br>`;
    }else{
        result_area.innerHTML += `${file.name}:<span style="color:red">incorrect</span><br>`;
    }
    return true;
}