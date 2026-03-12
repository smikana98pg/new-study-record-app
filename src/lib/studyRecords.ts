import { StudyRecord } from "../domain/studyRecord";
import { supabase } from "../../utils/supabase";

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

export async function insertStudyRecord(
  title: string,
  time: number,
): Promise<StudyRecord[]> {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ title, time }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const deleteStudies = async (id: string) => {
  await supabase.from("study-record").delete().eq("id", id);
};
