# 📋 PASOS PARA IMPLEMENTAR SINCRONIZACIÓN DE TIPOGRAFÍA

## Estado Actual
- ✅ Backend actualizado para enviar/recibir campos de tipografía
- ✅ Frontend ya envía los campos (sin cambios necesarios)
- ⏳ Base de datos: Necesita migración

---

## ✅ PASO 1: Ejecutar Migración SQL

**Ubicación:** `backend/migrations/001_add_typography_to_apariencia.sql`

### Opción A: Ejecutar desde terminal (PostgreSQL instalado localmente)

```bash
psql -h localhost -U tu_usuario -d tu_basedatos -f backend/migrations/001_add_typography_to_apariencia.sql
```

Reemplaza:
- `tu_usuario` → Tu usuario de PostgreSQL
- `tu_basedatos` → Tu BD (ej: `editorial_peregrinar`)

### Opción B: Ejecutar manualmente en Supabase / Railway

1. Accede a tu consola SQL:
   - **Supabase:** https://app.supabase.com → SQL Editor
   - **Railway:** Panel → PostgreSQL → Connect → SQL Client

2. Copia y ejecuta el contenido de:
   ```sql
   -- Copiar todo el contenido de backend/migrations/001_add_typography_to_apariencia.sql
   ```

3. O ejecuta manualmente si prefieres:
   ```sql
   ALTER TABLE configuracion_apariencia
   ADD COLUMN IF NOT EXISTS fuente_principal VARCHAR(50) DEFAULT 'Inter',
   ADD COLUMN IF NOT EXISTS fuente_titulos VARCHAR(50) DEFAULT 'Inter',
   ADD COLUMN IF NOT EXISTS tamano_titulos VARCHAR(20) DEFAULT 'medium',
   ADD COLUMN IF NOT EXISTS peso_titulos VARCHAR(10) DEFAULT '600';
   ```

4. Verifica que funcionó:
   ```sql
   \d configuracion_apariencia
   -- Deberías ver las 4 columnas nuevas
   ```

---

## ✅ PASO 2: Reiniciar Backend

```bash
cd backend
npm run dev
# o
npm start
```

Deberías ver:
```
Servidor funcionando en http://localhost:3000
```

---

## ✅ PASO 3: Testear el flujo completo

### Test 1: Cargar apariencia
```bash
curl -H "Authorization: Bearer TU_TOKEN" \
  http://localhost:3000/api/apariencia
```

Deberías recibir:
```json
{
  "existe": true,
  "configuracion": {
    "id": ...,
    "fuente_principal": "Inter",      ← NUEVO
    "fuente_titulos": "Inter",        ← NUEVO
    "tamano_titulos": "medium",       ← NUEVO
    "peso_titulos": "600",            ← NUEVO
    ...
  }
}
```

### Test 2: Guardar apariencia
Accede a `http://localhost:3000/admin/apariencia.html` (o donde esté tu página):

1. **Iniciar sesión** con tu usuario admin
2. Ir a **Apariencia**
3. Cambiar **cualquier fuente** (ej: Inter → Poppins)
4. Cambiar **tamaño de títulos** (ej: medium → large)
5. Cambiar **peso** (ej: 600 → 700)
6. Hacer click en **"Guardar cambios"**
7. Deberías ver: `"Cambios guardados correctamente"`

### Test 3: Recargar y verificar persistencia
1. **Recarga la página** (F5)
2. Los valores deberían ser los que guardaste
3. Los botones de **"Restaurar"** NO deben aparecer (porque coinciden con guardados)

---

## 🔄 Verificación en tiempo real

### En el navegador (Consola)
```javascript
// Abre DevTools (F12) → Console
// Verifica que se imprime:
// ✓ Apariencia cargada: { fuente_principal: "...", ... }
// ✓ Apariencia guardada: { ... }
```

### En el backend (Terminal)
```
Enviando configuración: {
  fuente_principal: "Poppins",  ← NUEVO
  fuente_titulos: "Roboto",     ← NUEVO
  tamano_titulos: "large",      ← NUEVO
  peso_titulos: "700",          ← NUEVO
  ...
}
```

---

## ✅ PASO 4: Verificar en BD

**PostgreSQL local:**
```bash
psql -U tu_usuario -d tu_basedatos
```

```sql
SELECT nombre_tienda, fuente_principal, fuente_titulos, tamano_titulos, peso_titulos
FROM configuracion_apariencia
LIMIT 1;
```

**Supabase/Railway:** Mismo SQL en su consola SQL

Resultado esperado:
```
 nombre_tienda | fuente_principal | fuente_titulos | tamano_titulos | peso_titulos
---------------+------------------+----------------+----------------+--------------
 Mi tienda     | Poppins          | Roboto         | large          | 700
```

---

## 🎯 ¿Qué cambió?

| Componente | Antes | Después | Estado |
|---|---|---|---|
| **Backend GET** | 13 campos | **17 campos** ✅ | Tipografía incluida |
| **Backend PUT** | 12 campos | **16 campos** ✅ | Tipografía guardada |
| **BD** | Sin tipografía | **4 columnas nuevas** ✅ | Datos persistentes |
| **Frontend** | Envía pero BD ignora | **Todo funciona** ✅ | Sincronizado |

---

## ⚠️ Si algo falla

### Error: "column does not exist"
**Causa:** No ejecutaste la migración SQL
**Solución:** Ejecuta el SQL del Paso 1

### Error: "nombre_tienda" is NULL
**Causa:** Conflicto en UPSERT
**Solución:** Ejecuta en BD:
```sql
DELETE FROM configuracion_apariencia WHERE nombre_tienda IS NULL;
```

### Error: JWT inválido
**Causa:** Token expirado
**Solución:** 
1. Abre DevTools → Application → localStorage
2. Elimina el `token` 
3. Inicia sesión nuevamente

### Los cambios no se guardan
**Causa:** Probablemente la migración SQL no se ejecutó
**Solución:** Verifica con:
```sql
\d configuracion_apariencia
```

---

## ✨ Próximos pasos

Una vez confirmado que funciona:

1. **Completar estilos de botones/tarjetas** (aplicarEstiloBotones/Tarjetas)
2. **Implementar upload de logo** (nuevo endpoint en backend)
3. **Modularizar frontend code**

¿Necesitás ayuda con algo? Avísame.
