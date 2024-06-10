export interface TrainingData {
    role: 'system' | 'user' | 'assistant'
    content: string
}
export interface ModelData {
    messages: TrainingData[]
}