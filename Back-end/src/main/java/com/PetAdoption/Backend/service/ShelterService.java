package com.PetAdoption.Backend.service;

import com.PetAdoption.Backend.entity.Shelter;
import com.PetAdoption.Backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ShelterService {

    @Autowired
    private ShelterRepository shelterRepository;

    public Shelter createShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    public Shelter getShelterByName(String name){
        return shelterRepository.findById(name).orElse(null);
    }

    public Shelter updateShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    public void deleteShelter(Shelter shelter) {
        shelterRepository.delete(shelter);
    }

    public List<Shelter> findSheltersByNameContaining(String name) {
        return shelterRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Shelter> findSheltersByNameContainingPaged(String name, int size, int offset) {
        Pageable pageable = PageRequest.of(offset / size, size);
        return shelterRepository.findByNameContainingIgnoreCase(name, pageable).getContent();
    }

    public List<Shelter> getAllSheltersPaged(int size, int offset) {
        Pageable pageable = PageRequest.of(offset / size, size);
        return shelterRepository.findAll(pageable).getContent();
    }
}
