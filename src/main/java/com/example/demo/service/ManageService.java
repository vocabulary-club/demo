package com.example.demo.service;

import com.example.demo.repository.MainRepository;
import com.example.demo.repository.ManageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Service
public class ManageService {

    private final ManageRepository manageRepository;

    public ManageService(ManageRepository manageRepository) {
        this.manageRepository = manageRepository;
    }

    public Object create(Map<String, Object> data) {

        int nEngId = manageRepository.saveVocEng(data);
        int nMonId = manageRepository.saveVocMon(data);
        if(nEngId == 1 && nMonId == 1) {
            return manageRepository.saveVocDic(data);
        }
        return 0;
    }
}
