import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { SettingsType } from "./saveDataType";
import { SETTINGS_FILE_NAME } from "./constants";

export const loadSettings = async () => {
  try {
    const settings: SettingsType = JSON.parse(
      await readTextFile(SETTINGS_FILE_NAME, {
        baseDir: BaseDirectory.AppLocalData,
      })
    );
    return settings;
  } catch (error) {
    throw error;
  }
};

export const saveSettings = async (settings: SettingsType) => {
  try {
    await writeTextFile(SETTINGS_FILE_NAME, JSON.stringify(settings), {
      baseDir: BaseDirectory.AppLocalData,
    });
  } catch (error) {
    throw error;
  }
};
