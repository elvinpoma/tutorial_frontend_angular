/**
 * Que el enlace a pageable sea : "src/app/core/model/page/Pageable";
 * Puede causar problemas de compilación si se hace referencia a la ruta incorrecta.
 * Por eso uso el ./Pageable ya que estan en la misma carpeta
 */
import { Pageable } from "./Pageable";

export interface PaginatedData <TData>{
    content: TData[];
    pageable: Pageable;
    totalElements: number;
}
