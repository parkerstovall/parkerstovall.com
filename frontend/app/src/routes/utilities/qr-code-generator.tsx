import { createFileRoute } from '@tanstack/react-router'
import * as QRCode from 'qrcode'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/utilities/qr-code-generator')({
  component: QrCodeGenerator,
})

function QrCodeGenerator() {
  const [value, setValue] = useState('https://parkerstovall.com')
  const [lastGeneratedValue, setLastGeneratedValue] = useState('')
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const normalizeValue = (text: string) => text.trim()

  const generateQrCode = async () => {
    if (!input.current || !canvas.current) {
      return
    }

    const nextValue = normalizeValue(input.current.value)

    if (!nextValue) {
      setError('Add a URL or text value to generate a QR code.')
      return
    }

    setError('')

    await QRCode.toCanvas(canvas.current, nextValue, {
      errorCorrectionLevel: 'L',
      width: 320,
      margin: 1,
    })

    setLastGeneratedValue(nextValue)
  }

  const saveQrCode = async () => {
    if (!input.current || !lastGeneratedValue) {
      setError('Generate a QR code before saving it.')
      return
    }

    const dataUrl = await QRCode.toDataURL(lastGeneratedValue, {
      errorCorrectionLevel: 'L',
      width: 1024,
      margin: 1,
    })

    const downloadLink = document.createElement('a')
    downloadLink.download = 'qr-code.png'
    downloadLink.href = dataUrl
    downloadLink.click()
    downloadLink.remove()
  }

  return (
    <main className="site-page utility-page">
      <span className="eyebrow">Utilities</span>
      <section className="surface-card utility-card">
        <header className="utility-header">
          <h1 className="section-title">QR Code Generator</h1>
          <p className="section-text">
            Turn any URL or text into a downloadable QR code.
          </p>
        </header>

        <label htmlFor="qr-code-input" className="utility-label">
          URL or text
        </label>
        <input
          id="qr-code-input"
          type="text"
          ref={input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="utility-input"
          placeholder="https://example.com"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void generateQrCode()
            }
          }}
        />

        {error ? <p className="utility-error">{error}</p> : null}

        <div className="utility-actions">
          <button
            type="button"
            className="utility-button"
            onClick={generateQrCode}
          >
            Generate QR Code
          </button>
          <button type="button" className="utility-button" onClick={saveQrCode}>
            Save QR Code
          </button>
        </div>

        <div className="utility-preview" aria-live="polite">
          <canvas ref={canvas}></canvas>
        </div>
      </section>
    </main>
  )
}
