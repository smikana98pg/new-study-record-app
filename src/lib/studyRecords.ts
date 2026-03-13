import { StudyRecord } from "../domain/studyRecord";
import { supabase } from "../../utils/supabase";

//データ取得関数
export async function getAllStudyRecords(): Promise<StudyRecord[]> {
  const response = await supabase.from("study-record").select("*");

  if (response.error) {
    throw new Error(response.error.message);
  }
  const studyRecords = response.data.map((studyRecord) => {
    return StudyRecord.newStudyRecord(
      studyRecord.id,
      studyRecord.title,
      studyRecord.time,
      studyRecord.created_at,
    );
  });

  return studyRecords;
}

//データ登録関数
export async function insertStudyRecord(
  title: string,
  time: number,
): Promise<void> {
  const { error } = await supabase
    .from("study-record")
    .insert([{ title, time }]);

  if (error) throw error;
}

//データ削除関数
export async function deleteStudyRecord(id: string): Promise<void> {
  const { error } = await supabase.from("study-record").delete().eq("id", id);

  if (error) throw error;
}

//データ更新関数
export async function updateStudyRecord(
  id: string,
  title: string,
  time: number,
): Promise<void> {
  const { error } = await supabase
    .from("study-record")
    .update({ title: title, time: time })
    .eq("id", id);
  if (error) throw error;
}
