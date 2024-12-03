import { describe, expect, it } from 'vitest'
import { Enum } from './enum'


describe('enum', () => {
  it('parses an as-const object values', () => {
    const Direction = {
      Left: 'LEFT',
      Right: 'RIGHT',
    } as const;
    const schema = Enum(Direction)
    const result = schema.parse(Direction.Left)
    expect(result).toEqual({ success: true, value: Direction.Left })
  })

  it('parses an enum with string values', () => {
    enum Direction {
      Left = 'LEFT',
      Right = 'RIGHT',
    }
    
    const schema = Enum(Direction)
    const result = schema.parse(Direction.Left)
    expect(result).toEqual({ success: true, value: Direction.Left })
  })

  it('parses an enum', () => {
    enum Direction {
      Left,
      Right,
    }
    
    const schema = Enum(Direction)
    const result = schema.parse(Direction.Left)
    expect(result).toEqual({ success: true, value: Direction.Left })
  })
})
