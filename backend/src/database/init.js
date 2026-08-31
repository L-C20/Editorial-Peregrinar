// =====================================================
// INICIALIZACIÓN DE BASE DE DATOS
// Ejecuta migraciones automáticamente al iniciar
// =====================================================

const pool = require('./connection');

async function inicializarBD() {
    try {
        console.log('🔧 Inicializando base de datos...');

        // =====================================================
        // MIGRACIÓN 001: Agregar campos de tipografía
        // =====================================================

        console.log('📝 Ejecutando migración: tipografía...');

        await pool.query(`
            ALTER TABLE configuracion_apariencia
            ADD COLUMN IF NOT EXISTS fuente_principal VARCHAR(50) DEFAULT 'Inter',
            ADD COLUMN IF NOT EXISTS fuente_titulos VARCHAR(50) DEFAULT 'Inter',
            ADD COLUMN IF NOT EXISTS tamano_titulos VARCHAR(20) DEFAULT 'medium',
            ADD COLUMN IF NOT EXISTS peso_titulos VARCHAR(10) DEFAULT '600'
        `);

        console.log('✅ Columnas de tipografía agregadas');

        // =====================================================
        // VERIFICACIÓN
        // =====================================================

        const resultado = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'configuracion_apariencia'
            AND column_name IN ('fuente_principal', 'fuente_titulos', 'tamano_titulos', 'peso_titulos')
        `);

        if (resultado.rows.length === 4) {
            console.log('✨ Base de datos lista - todas las columnas existen');
            return true;
        } else {
            console.log(`⚠️ Solo ${resultado.rows.length}/4 columnas de tipografía encontradas`);
            return false;
        }

    } catch (error) {
        // Si la tabla no existe aún, no es un error fatal
        if (error.message.includes('does not exist') || error.message.includes('no existe')) {
            console.log('ℹ️ Tabla configuracion_apariencia no existe aún (se creará después)');
            return false;
        }

        console.error('❌ Error inicializando BD:', error.message);
        return false;
    }
}

module.exports = inicializarBD;
