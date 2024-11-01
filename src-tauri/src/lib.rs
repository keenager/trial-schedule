use std::{fs::{self, write, File}, io::Error};
use std::collections::HashMap;
use calamine::{open_workbook, Reader, Xlsx};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![read_file_command, read_data_from_excel, save_file_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_file_command(file_path: String) -> String{
    println!("I was invoked from Javascript, file path is: {}", file_path);
    match fs::read_to_string(file_path) {
        Ok(result) => result,
        Err(e) => e.to_string()

    }
}

#[tauri::command]
fn read_data_from_excel(file_path: String) -> Vec<HashMap<String, String>>{
    let mut workbook: Xlsx<_> = open_workbook(file_path).unwrap();
    let mut data: Vec<HashMap<String, String>> = Vec::new();

    if let Ok(r) = workbook.worksheet_range("오늘기준 월간일정") {
        for row in r.rows() {
            let mut val: HashMap<String, String> = HashMap::new();
            val.insert("날짜".to_string(), row[0].to_string());
            val.insert("시각".to_string(), row[1].to_string());
            val.insert("기일종류".to_string(), row[3].to_string());
            val.insert("사건번호".to_string(), row[4].to_string());
            val.insert("피고인".to_string(), row[6].to_string());
            val.insert("사건명".to_string(), row[7].to_string());
            val.insert("소요예정시간".to_string(), row[9].to_string());
            data.push(val);
        }
    }
    println!("{:?}", data);
    data
}

#[tauri::command]
fn save_file_command(file_path: String, contents: String) -> String {
    println!("path: {}, contents: {}", &file_path, contents);

    
    
    let file_result: Result<File, Error> = File::create(file_path.clone());
    

    match file_result {
        Ok(_) => {
            let save_result: Result<(), Error> = write(file_path, contents);
            match save_result {
                Ok(_) => (),
                Err(e) => {
                    return e.to_string();
                }
            }
            "성공!".to_string()
        },
        Err(e) => e.to_string()
    }
}
