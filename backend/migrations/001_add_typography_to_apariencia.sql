-- =====================================================
-- MIGRACIÓN 001: Agregar campos de tipografía a configuracion_apariencia
-- =====================================================
-- Fecha: 2026-08-30
-- Descripción: Agrega columnas para tipografía que faltaban en la tabla
--
-- Si estas columnas YA EXISTEN en tu BD, simplemente ejecuta:
-- SELECT 1 WHERE EXISTS (
--   SELECT 1 FROM information_schema.columns
--   WHERE table_name='configuracion_apariencia'
--   AND column_name='fuente_principal'
-- );
--
-- Si retorna 1, no ejecutes esta migración.
-- =====================================================

-- Agregar columnas si no existen (PostgreSQL 9.6+)
ALTER TABLE configuracion_apariencia
ADD COLUMN IF NOT EXISTS fuente_principal VARCHAR(50) DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS fuente_titulos VARCHAR(50) DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS tamano_titulos VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS peso_titulos VARCHAR(10) DEFAULT '600';

-- Verificar que las columnas existan
\d configuracion_apariencia

-- =====================================================
-- NOTA: Si tu BD no soporta "IF NOT EXISTS", ejecuta manualmente:
-- =====================================================
--
-- ALTER TABLE configuracion_apariencia
-- ADD COLUMN fuente_principal VARCHAR(50) DEFAULT 'Inter';
--
-- ALTER TABLE configuracion_apariencia
-- ADD COLUMN fuente_titulos VARCHAR(50) DEFAULT 'Inter';
--
-- ALTER TABLE configuracion_apariencia
-- ADD COLUMN tamano_titulos VARCHAR(20) DEFAULT 'medium';
--
-- ALTER TABLE configuracion_apariencia
-- ADD COLUMN peso_titulos VARCHAR(10) DEFAULT '600';
