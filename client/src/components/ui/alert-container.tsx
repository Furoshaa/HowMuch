import { useAlert } from './alert-context'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert()

  if (alerts.length === 0) return null

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'info':
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    return type === 'error' ? 'destructive' : 'default'
  }

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600'
    }
  }

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 w-full max-w-sm">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={getAlertVariant(alert.type)}
          className={cn(
            "animate-in slide-in-from-right-full transition-all duration-300",
            getAlertStyles(alert.type)
          )}
        >
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            {alert.title && (
              <AlertTitle className="mb-1">{alert.title}</AlertTitle>
            )}
            <AlertDescription>{alert.message}</AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-transparent"
            onClick={() => removeAlert(alert.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Close alert</span>
          </Button>
        </Alert>
      ))}
    </div>
  )
}
