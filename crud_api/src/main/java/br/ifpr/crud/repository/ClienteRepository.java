package br.ifpr.crud.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ifpr.crud.model.Cliente;

public interface ClienteRepository extends 
	JpaRepository<Cliente, Integer> {

}
