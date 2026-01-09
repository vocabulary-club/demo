package com.example.demo.service;

import com.example.demo.repository.MainRepository;
import com.example.demo.repository.ManageRepository;
import org.springframework.stereotype.Service;

@Service
public class ManageService {

    private final ManageRepository manageRepository;

    public ManageService(ManageRepository manageRepository) {
        this.manageRepository = manageRepository;
    }

    public Object getVocDic() {

        return manageRepository.getVocDic();
    }

}
