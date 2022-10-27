#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use pandoc::{OutputKind, Pandoc, PandocOutput};
use std::env;
use std::path::PathBuf;
use tauri::api::dialog;
use tauri::api::process::{Command, CommandEvent};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

struct AppState<'a> {
    pandoc_path: &'a str,
    template_source: &'a str,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn emit_event(window: tauri::Window) {
    window
        .emit("click-event", Payload { message: String::from("clicked button") })
        .expect("failed to emit event");
}

#[tauri::command]
fn get_template_source(window: tauri::Window, state: tauri::State<'_, AppState>) {
    dialog::FileDialogBuilder::default()
        .add_filter("Document", &["doc", "docx", "md"])
        .pick_file(move |path_buf| {
            if let Some(path_buf) = path_buf {
                // let (mut rx, mut _child) = Command::new_sidecar("pandoc")
                //     .expect("failed to create sidecar")
                //     .args(["-t", "html", &path_buf.display().to_string()]) // pandoc -t html input.txt
                //     .spawn()
                //     .expect("Failed to spawn pandoc");
                // tauri::async_runtime::spawn(async move {
                //     let mut output = String::new();
                //     // read events such as stdout
                //     while let Some(event) = rx.recv().await {
                //         if let CommandEvent::Stdout(line) = event {
                //             output.push_str(line.as_str())
                //         }
                //     }
                //     println!("{}", output);
                // });

                let mut pandoc = Pandoc::new();
                pandoc.add_pandoc_path_hint(
                    "/workspaces/Bulk-PDF-Generator/MultiPDF/src-tauri/target/debug/",
                );
                pandoc.add_input(path_buf.as_path());
                pandoc.set_output_format(pandoc::OutputFormat::Html, [].to_vec());
                pandoc.set_output(OutputKind::Pipe);
                let out = pandoc.execute().expect("failed to execute pandoc");
                if let PandocOutput::ToBuffer(out) = out {
                    println!("{}", out);
                    window
                        .emit("my-event", Payload { message: out })
                        .expect("failed to emit event");
                }
            }
        });
}

// fn read_file(file_handle: &Path) -> String {
//     //
//     // let mut dir = env::temp_dir();
//     // dir.push("multipdf_doc2html.html");
//     // let out_file = dir.into_os_string().into_string().unwrap();
// }

fn main() {
    let stdcmd: std::process::Command = tauri::api::process::Command::new_sidecar("pandoc")
        .expect("failed to create sidecar")
        .into();

    let mut cmdpath = PathBuf::from(stdcmd.get_program());
    cmdpath.pop();

    let state = AppState {
        pandoc_path: "/workspaces/Bulk-PDF-Generator/MultiPDF/src-tauri/target/debug/",
        template_source: "Hello",
    };

    tauri::Builder::default()
        .manage(state)
        .setup(|_app| Ok(()))
        .invoke_handler(tauri::generate_handler![greet, emit_event, get_template_source])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
