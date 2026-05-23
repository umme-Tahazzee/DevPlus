


export type ISSUE_STATUS = "open" | "in_progress" | "resolved"


export interface Iissues {
    title: string
    description: string
    type: string
    status?: ISSUE_STATUS
    reporter_id : number
}