//   const readSavedHandler = async () => {
//     const filePath = await open({ multiple: false, directory: false });
//     if (!filePath) return;
//     const result = await invoke<string>("read_file_command", { filePath });
//     // setMsg(result);
//   };

// const saveHandler = async () => {
//   // try {
//   //   await writeTextFile("testFile.txt", "Hello World!!!", {
//   //     baseDir: BaseDirectory.Document,
//   //   });
//   //   setMsg("성공!");
//   // } catch (e) {
//   //   setMsg(e as string);
//   // }
//   const dirPath = await open({ multiple: false, directory: true });
//   if (!dirPath) return;

//   const contents = JSON.stringify(tcList);
//   const result = await invoke<string>("save_file_command", {
//     filePath: dirPath + "\\testFile.txt",
//     contents,
//   });
//   setMsg(result);
// };
