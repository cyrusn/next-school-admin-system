import { getArrayData } from '@/utils/googleSheet'

const spreadsheetId = process.env.FLIPPED_CLASSROOM_SSID

const getHandler = async (req, res) => {
  try {
    const data = await getArrayData(
      spreadsheetId,
      'SubjectOrDepartments!A2:A',
      (rowNo) => `A${rowNo}:J${rowNo}`
    )

    res.status(200).json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    res.status(500).json({ error })
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  await getHandler(req, res)
}
