import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download,
  ArrowRight,
  Users,
  MapPin
} from 'lucide-react'
import { Participant } from '@/types'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (participants: Participant[]) => Promise<void>
  registrationId: string
}

interface CSVRow {
  [key: string]: string
}

interface FieldMapping {
  csvField: string
  dbField: string
  required: boolean
}

interface ImportPreview {
  valid: Participant[]
  invalid: { row: number; data: CSVRow; errors: string[] }[]
  warnings: { row: number; data: CSVRow; warnings: string[] }[]
}

const DATABASE_FIELDS = [
  { key: 'firstName', label: 'First Name', required: true, type: 'text' },
  { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'phone', label: 'Phone', required: false, type: 'text' },
  { key: 'dateOfBirth', label: 'Date of Birth', required: false, type: 'date' },
  { key: 'emergencyContactName', label: 'Emergency Contact Name', required: false, type: 'text' },
  { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', required: false, type: 'text' },
  { key: 'medicalConditions', label: 'Medical Conditions', required: false, type: 'text' },
  { key: 'dietaryRestrictions', label: 'Dietary Restrictions', required: false, type: 'text' },
]

export function ImportModal({ isOpen, onClose, onImport, registrationId }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'complete'>('upload')
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetModal = () => {
    setStep('upload')
    setCsvData([])
    setCsvHeaders([])
    setFieldMappings([])
    setImportPreview(null)
    setImportProgress(0)
    setImportResults(null)
    setDragActive(false)
  }

  const downloadTemplate = () => {
    const headers = DATABASE_FIELDS.map(field => field.label).join(',')
    const sampleData = [
      'John,Doe,john.doe@email.com,(555) 123-4567,1995-06-15,Jane Doe,(555) 987-6543,None,Vegetarian',
      'Sarah,Smith,sarah.smith@email.com,(555) 234-5678,1998-03-22,Bob Smith,(555) 876-5432,Asthma,Gluten-free',
      'Mike,Johnson,mike.johnson@email.com,(555) 345-6789,1997-11-08,Lisa Johnson,(555) 765-4321,Diabetes,No nuts'
    ]
    
    const csvContent = [headers, ...sampleData].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'participant_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const parseCSV = (text: string): { headers: string[]; data: CSVRow[] } => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('CSV file is empty')

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data: CSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: CSVRow = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      data.push(row)
    }

    return { headers, data }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text()
      const { headers, data } = parseCSV(text)
      
      setCsvHeaders(headers)
      setCsvData(data)
      
      // Auto-map fields based on common naming patterns
      const autoMappings: FieldMapping[] = DATABASE_FIELDS.map(dbField => {
        const csvField = headers.find(header => {
          const headerLower = header.toLowerCase()
          const fieldLower = dbField.key.toLowerCase()
          
          // Direct match
          if (headerLower === fieldLower) return true
          
          // Common variations
          const variations: { [key: string]: string[] } = {
            firstName: ['first_name', 'firstname', 'fname', 'first'],
            lastName: ['last_name', 'lastname', 'lname', 'last', 'surname'],
            email: ['email_address', 'e_mail', 'mail'],
            phone: ['phone_number', 'telephone', 'mobile', 'cell'],
            dateOfBirth: ['date_of_birth', 'dob', 'birth_date', 'birthdate'],
            emergencyContactName: ['emergency_contact', 'emergency_name', 'contact_name'],
            emergencyContactPhone: ['emergency_phone', 'emergency_number', 'contact_phone'],
            medicalConditions: ['medical', 'medical_info', 'health_conditions'],
            dietaryRestrictions: ['dietary', 'diet', 'food_restrictions', 'allergies']
          }
          
          return variations[dbField.key]?.some(variation => headerLower.includes(variation))
        })
        
        return {
          csvField: csvField || '',
          dbField: dbField.key,
          required: dbField.required
        }
      })
      
      setFieldMappings(autoMappings)
      setStep('mapping')
    } catch (error) {
      console.error('Error parsing CSV:', error)
      alert('Error parsing CSV file. Please check the format and try again.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleFileUpload(csvFile)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const updateFieldMapping = (dbField: string, csvField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.dbField === dbField 
          ? { ...mapping, csvField }
          : mapping
      )
    )
  }

  const validateAndPreview = () => {
    const valid: Participant[] = []
    const invalid: ImportPreview['invalid'] = []
    const warnings: ImportPreview['warnings'] = []

    csvData.forEach((row, index) => {
      const errors: string[] = []
      const rowWarnings: string[] = []
      const participantData: Partial<Participant> = {
        id: `import_${Date.now()}_${index}`,
        userId: 'current_user', // This would be set from auth context
        registrationId,
        registrationDate: new Date().toISOString(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Map fields
      fieldMappings.forEach(mapping => {
        if (mapping.csvField && row[mapping.csvField]) {
          const value = row[mapping.csvField].trim()
          
          // Validate required fields
          if (mapping.required && !value) {
            errors.push(`${mapping.dbField} is required`)
            return
          }

          // Type-specific validation
          const dbField = DATABASE_FIELDS.find(f => f.key === mapping.dbField)
          if (dbField && value) {
            switch (dbField.type) {
              case 'email': {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  errors.push(`Invalid email format: ${value}`)
                } else {
                  participantData[mapping.dbField as keyof Participant] = value as any
                }
                break
              }
              case 'date': {
                const date = new Date(value)
                if (isNaN(date.getTime())) {
                  rowWarnings.push(`Invalid date format for ${mapping.dbField}: ${value}`)
                } else {
                  participantData[mapping.dbField as keyof Participant] = date.toISOString().split('T')[0] as any
                }
                break
              }
              default:
                participantData[mapping.dbField as keyof Participant] = value as any
            }
          }
        } else if (mapping.required) {
          errors.push(`${mapping.dbField} is required but no CSV field is mapped`)
        }
      })

      // Check for duplicate emails in the same import
      if (participantData.email) {
        const duplicateInImport = valid.find(p => p.email === participantData.email)
        if (duplicateInImport) {
          rowWarnings.push(`Duplicate email found in import: ${participantData.email}`)
        }
      }

      if (errors.length > 0) {
        invalid.push({ row: index + 2, data: row, errors }) // +2 because of header row and 0-based index
      } else {
        if (rowWarnings.length > 0) {
          warnings.push({ row: index + 2, data: row, warnings: rowWarnings })
        }
        valid.push(participantData as Participant)
      }
    })

    setImportPreview({ valid, invalid, warnings })
    setStep('preview')
  }

  const executeImport = async () => {
    if (!importPreview) return

    setStep('importing')
    setImportProgress(0)

    try {
      const batchSize = 10
      let processed = 0
      let successful = 0
      let failed = 0

      for (let i = 0; i < importPreview.valid.length; i += batchSize) {
        const batch = importPreview.valid.slice(i, i + batchSize)
        
        try {
          await onImport(batch)
          successful += batch.length
        } catch (error) {
          console.error('Batch import failed:', error)
          failed += batch.length
        }

        processed += batch.length
        setImportProgress((processed / importPreview.valid.length) * 100)
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setImportResults({ success: successful, failed })
      setStep('complete')
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
      setStep('preview')
    }
  }

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
        <p className="text-gray-600 mb-6">
          Upload a CSV file containing participant information to import into your camp registration.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Choose File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>CSV Format Requirements:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>First row should contain column headers</li>
            <li>Required fields: First Name, Last Name, Email</li>
            <li>Optional fields: Phone, Date of Birth, Emergency Contact info, Medical info</li>
            <li>Use standard date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button variant="outline" className="mr-2" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>
    </div>
  )

  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Map CSV Fields</h3>
        <p className="text-gray-600 mb-6">
          Match your CSV columns to the database fields. Required fields must be mapped.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-blue-900">CSV File Loaded</p>
            <p className="text-sm text-blue-700">{csvData.length} rows found</p>
          </div>
          <Badge variant="secondary">{csvHeaders.length} columns</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold">Field Mapping</h4>
        {DATABASE_FIELDS.map(dbField => {
          const mapping = fieldMappings.find(m => m.dbField === dbField.key)
          return (
            <div key={dbField.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{dbField.label}</span>
                  {dbField.required && (
                    <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{dbField.type}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
              <div className="flex-1">
                <Select
                  value={mapping?.csvField || ''}
                  onValueChange={(value) => updateFieldMapping(dbField.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CSV column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Skip this field --</SelectItem>
                    {csvHeaders.map(header => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('upload')}>
          Back
        </Button>
        <Button 
          onClick={validateAndPreview}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!fieldMappings.some(m => m.required && m.csvField)}
        >
          Preview Import
        </Button>
      </div>
    </div>
  )

  const renderPreviewStep = () => {
    if (!importPreview) return null

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Import Preview</h3>
          <p className="text-gray-600 mb-6">
            Review the data before importing. Fix any errors before proceeding.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{importPreview.valid.length}</p>
              <p className="text-sm text-green-600">Valid Records</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{importPreview.warnings.length}</p>
              <p className="text-sm text-yellow-600">Warnings</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{importPreview.invalid.length}</p>
              <p className="text-sm text-red-600">Errors</p>
            </CardContent>
          </Card>
        </div>

        {importPreview.invalid.length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Errors ({importPreview.invalid.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 max-h-48 overflow-y-auto">
              {importPreview.invalid.map((item, index) => (
                <div key={index} className="mb-4 p-3 bg-red-50 rounded border border-red-200">
                  <p className="font-medium text-red-800">Row {item.row}</p>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                    {item.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {importPreview.warnings.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-yellow-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Warnings ({importPreview.warnings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 max-h-48 overflow-y-auto">
              {importPreview.warnings.map((item, index) => (
                <div key={index} className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="font-medium text-yellow-800">Row {item.row}</p>
                  <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                    {item.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('mapping')}>
            Back to Mapping
          </Button>
          <Button 
            onClick={executeImport}
            className="bg-green-600 hover:bg-green-700"
            disabled={importPreview.valid.length === 0}
          >
            <Users className="h-4 w-4 mr-2" />
            Import {importPreview.valid.length} Participants
          </Button>
        </div>
      </div>
    )
  }

  const renderImportingStep = () => (
    <div className="space-y-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <h3 className="text-lg font-semibold">Importing Participants...</h3>
      <div className="space-y-2">
        <Progress value={importProgress} className="w-full" />
        <p className="text-sm text-gray-600">{Math.round(importProgress)}% complete</p>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold text-green-800">Import Complete!</h3>
      
      {importResults && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-700">{importResults.success}</p>
              <p className="text-sm text-green-600">Successfully Imported</p>
            </CardContent>
          </Card>
          {importResults.failed > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-red-700">{importResults.failed}</p>
                <p className="text-sm text-red-600">Failed</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
        Close
      </Button>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Import Participants from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {step === 'upload' && renderUploadStep()}
          {step === 'mapping' && renderMappingStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'importing' && renderImportingStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>
      </DialogContent>
    </Dialog>
  )
}