package br.ifpr.crud.controller;

import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.ifpr.crud.exception.ApiException;
import br.ifpr.crud.model.Veiculo;
import br.ifpr.crud.repository.VeiculoRepository;

@CrossOrigin
@RestController
@RequestMapping("/veiculos")
public class VeiculoController {
	
	@Autowired
	private VeiculoRepository veiculoRepository;
	
	@GetMapping
	public List<Veiculo> listar() {
		return veiculoRepository.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Veiculo> buscar(@PathVariable Integer id) {
		Optional<Veiculo> optVeiculo = veiculoRepository.findById(id);
		
		if(optVeiculo.isPresent())
			return new ResponseEntity<Veiculo>(optVeiculo.get(), HttpStatus.OK);
		
		return new ResponseEntity<Veiculo>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping
	public ResponseEntity<Veiculo> inserir(@RequestBody Veiculo veiculo) {
		
		try {
			veiculoRepository.save(veiculo);
			
			return new ResponseEntity<Veiculo>(veiculo, HttpStatus.OK);
		} catch(Exception e) {
			throw new ApiException("Erro ao cadastrar o veiculo.");
		}
		
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Veiculo> atualizar(@PathVariable Integer id, @RequestBody Veiculo veiculo) {
		
		if(!veiculoRepository.existsById(id))
			return new ResponseEntity<Veiculo>(HttpStatus.NOT_FOUND);
		
		try {
			veiculo.setId(id);
			veiculoRepository.save(veiculo);
			
			return new ResponseEntity<Veiculo>(veiculo, HttpStatus.OK);
		} catch(Exception e) {
			throw new ApiException("Erro ao atualizar o veiculo.");
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Veiculo> remover(@PathVariable Integer id) {
		if(! veiculoRepository.existsById(id))
			return new ResponseEntity<Veiculo>(HttpStatus.NOT_FOUND);
		
		try {
			veiculoRepository.deleteById(id);
			
			return new ResponseEntity<Veiculo>(HttpStatus.OK);
		} catch (Exception e) {
			throw new ApiException("Erro ao remover o veiculo.");
		}
	}
	
}
