export class StudyRecord {
  readonly id: string;
  readonly title: string;
  readonly time: number;
  readonly created_at: string;

  constructor(id: string, title: string, time: number, created_at: string) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.created_at = created_at;
  }

  public static newStudyRecord(
    id: string,
    title: string,
    time: number,
    created_at: string,
  ): StudyRecord {
    return new StudyRecord(id, title, time, formatDate(created_at));
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ja-JP");
}
