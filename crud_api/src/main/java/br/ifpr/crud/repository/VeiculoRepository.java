package br.ifpr.crud.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ifpr.crud.model.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Integer> {

}
