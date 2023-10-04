import { Spinner as SpinnerChakra } from '@chakra-ui/react'

export default function Spinner({
  spinning = false
}) {
  if (!spinning) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 99,
      }}
    >
      <SpinnerChakra
        color='#ED64A6'
        size="xl"
        thickness='4px'
        speed='0.65s'
      />
    </div>
  )
}