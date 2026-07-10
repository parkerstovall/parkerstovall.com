import { createFileRoute } from '@tanstack/react-router'
import { QRCode } from 'qrcode'

export const Route = createFileRoute('/utilities/qr-code-generator')({
  component: QrCodeGenerator,
})

function QrCodeGenerator() {
  const generateQrCode = () => {
    const canvas = document.getElementById('canvas')
    const input = document.getElementById('text') as HTMLInputElement
    QRCode.toCanvas(canvas, input.value)
  }
  return (
    <div>
      <input type="text" id="Url" />
      <button onClick={generateQrCode}>Generate QR Code</button>
      <canvas id="canvas"></canvas>
    </div>
  )
}
